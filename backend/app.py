from flask import Flask, request, jsonify, send_from_directory, send_file,send_from_directory
from werkzeug.utils import secure_filename
import os
from PIL import Image
import tensorflow as tf
import numpy as np
import cv2
import logging
from flask_cors import CORS
from datetime import datetime
import json
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
#from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as ReportImage
#from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import pydicom
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as ReportLabImage
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import io
import os
from datetime import datetime
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = Flask(__name__)
CORS(app)

# Configuration
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MODEL_PATH'] = 'model/17.h5'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'dcm'}

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load the model
try:
    model = tf.keras.models.load_model(app.config['MODEL_PATH'])
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    model = None

def is_xray_image(image_path):
    """Check if the image is an X-ray using advanced image analysis."""
    try:
        # First check if it's a DICOM file
        try:
            pydicom.dcmread(image_path)
            return True
        except:
            pass

        # If not DICOM, analyze the image characteristics
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        
        # Check image properties typical for X-rays
        mean_intensity = np.mean(img)
        std_intensity = np.std(img)
        histogram = cv2.calcHist([img], [0], None, [256], [0, 256])
        
        # X-rays typically have:
        # 1. High contrast (high standard deviation)
        # 2. Specific intensity distribution
        # 3. Limited color range (grayscale)
        is_likely_xray = (
            std_intensity > 40 and  # High contrast
            mean_intensity > 50 and mean_intensity < 200 and  # Typical X-ray intensity range
            len(np.unique(img)) > 50  # Sufficient grayscale variation
        )
        
        return is_likely_xray
    except Exception as e:
        logging.error(f"Error checking if image is X-ray: {e}")
        return False

def detect_fracture_area(image):
    """Enhanced fracture detection using multiple techniques."""
    try:
        # Convert to grayscale if not already
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image

        # Apply advanced preprocessing
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(gray)
        
        # Multi-scale processing
        fracture_data = []
        scales = [1.0, 1.5, 2.0]  # Multiple scales for better detection
        
        for scale in scales:
            # Resize image for multi-scale processing
            width = int(image.shape[1] * scale)
            height = int(image.shape[0] * scale)
            scaled = cv2.resize(enhanced, (width, height))
            
            # Apply various edge detection methods
            edges_sobel_x = cv2.Sobel(scaled, cv2.CV_64F, 1, 0, ksize=3)
            edges_sobel_y = cv2.Sobel(scaled, cv2.CV_64F, 0, 1, ksize=3)
            edges_sobel = cv2.magnitude(edges_sobel_x, edges_sobel_y)
            
            # Normalize and threshold
            edges_sobel = cv2.normalize(edges_sobel, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
            _, thresh = cv2.threshold(edges_sobel, 50, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Morphological operations
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
            morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
            
            # Find contours
            contours, _ = cv2.findContours(morph, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Analyze each contour
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 100:  # Filter small contours
                    # Get bounding rectangle
                    x, y, w, h = cv2.boundingRect(contour)
                    
                    # Calculate fracture characteristics
                    perimeter = cv2.arcLength(contour, True)
                    circularity = 4 * np.pi * area / (perimeter * perimeter) if perimeter > 0 else 0
                    
                    # Only add if likely to be a fracture (based on shape characteristics)
                    if circularity < 0.8:  # Non-circular shapes are more likely to be fractures
                        # Scale back coordinates
                        x, y = int(x/scale), int(y/scale)
                        w, h = int(w/scale), int(h/scale)
                        
                        fracture_data.append({
                            'x': x,
                            'y': y,
                            'width': w,
                            'height': h,
                            'size': area/(scale*scale),
                            'confidence': (1 - circularity) * 100  # Higher confidence for less circular shapes
                        })
                        
                        # Draw rectangle on original image
                        cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
                        
                        # Add text for confidence
                        conf_text = f"{(1-circularity)*100:.1f}%"
                        cv2.putText(image, conf_text, (x, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        return image, fracture_data
    except Exception as e:
        logging.error(f"Error in fracture detection: {e}")
        return image, []

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as ReportLabImage
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import io
import os
from datetime import datetime

def generate_pdf_report(prediction, confidence, fracture_data, image_path, marked_image_path):
    """Generate a professional single-page PDF report."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Custom Styles
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=20, textColor=colors.darkblue, alignment=1)
    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=14, textColor=colors.darkred, spaceAfter=8)
    normal_style = ParagraphStyle('Normal', parent=styles['Normal'], fontSize=11)
    branding_style = ParagraphStyle('Branding', parent=styles['Normal'], fontSize=12, textColor=colors.gray, alignment=1)
    
    # Report Header with Branding
    story.append(Paragraph("BoneAI - Nexariza Health Report", title_style))
    story.append(Paragraph("Powered by Ahmad Yasin & Nexariza", branding_style))
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", normal_style))
    story.append(Spacer(1, 10))
    
    # Patient and Doctor Details Table
    details_table = [["Patient Name:", "______________________", "Doctor Name:", "______________________"],
                     ["Age:", "______________________", "Signature:", "______________________"],
                     ["Gender:", "______________________", "Date:", "______________________"]]
    table = Table(details_table, colWidths=[80, 140, 80, 140])
    table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10)
    ]))
    story.append(table)
    story.append(Spacer(1, 10))
    
    # X-ray Images and Analysis Results Section
    data = [[Paragraph("Analysis Results", heading_style), "", ""],
            [Paragraph(f"Prediction: {prediction}", normal_style), "", ""],
            [Paragraph(f"Confidence: {confidence:.2f}%", normal_style), "", ""],
            [ReportLabImage(image_path, width=200, height=200) if os.path.exists(image_path) else "", 
             "", 
             ReportLabImage(marked_image_path, width=200, height=200) if os.path.exists(marked_image_path) else ""]]
    image_table = Table(data, colWidths=[150, 10, 150])
    story.append(image_table)
    story.append(Spacer(1, 10))
    
    # Fracture Analysis and Recommendations Side by Side
    analysis_text = [Paragraph("Detailed Fracture Analysis", heading_style)]
    if fracture_data:
        for i, fracture in enumerate(fracture_data, 1):
            analysis_text.append(Paragraph(f"Fracture {i}: Location (x: {fracture['x']}, y: {fracture['y']}), Size: {fracture['size']:.2f} pixels, Confidence: {fracture['confidence']:.2f}%", normal_style))
    else:
        analysis_text.append(Paragraph("No fractures detected.", normal_style))
    
    recommendations_text = [Paragraph("Recommendations", heading_style)]
    if prediction == "Fracture":
        recommendations_text.append(Paragraph("• Seek immediate medical consultation.", normal_style))
        recommendations_text.append(Paragraph("• Avoid pressure on the affected area.", normal_style))
        recommendations_text.append(Paragraph("• Follow up with an orthopedic specialist.", normal_style))
    else:
        recommendations_text.append(Paragraph("• No immediate action required.", normal_style))
        recommendations_text.append(Paragraph("• Monitor symptoms and seek consultation if necessary.", normal_style))
    
    combined_table = Table([[analysis_text, recommendations_text]], colWidths=[230, 230])
    story.append(combined_table)
    story.append(Spacer(1, 10))
    
    # Footer with Branding and Disclaimer
    disclaimer_style = ParagraphStyle('Disclaimer', parent=normal_style, fontSize=8, textColor=colors.gray)
    story.append(Paragraph("DISCLAIMER: This report is AI-generated and should not replace professional medical evaluation.", disclaimer_style))
    story.append(Spacer(1, 5))
    story.append(Paragraph("© 2025 Nexariza | All Rights Reserved", branding_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer



def allowed_file(filename):
    """Check if the file type is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def preprocess_image(image_path, target_size=(180, 180)):
    """Preprocess image for prediction."""
    try:
        img = Image.open(image_path).convert('RGB')
        img = img.resize(target_size)
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array, np.array(img)
    except Exception as e:
        logging.error(f"Error processing image: {e}")
        return None, None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """Handle image upload and prediction with advanced analysis."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type.'}), 400

    try:
        # Save and process image
        filename = 'current_image.jpg'
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # # Check if image is an X-ray
        # if not is_xray_image(file_path):
        #     return jsonify({'error': 'The uploaded image does not appear to be an X-ray. Please upload a valid X-ray image.'}), 400
        
        # Preprocess for model
        img_array, original_img = preprocess_image(file_path)
        if img_array is None:
            return jsonify({'error': 'Error processing image.'}), 500

        # Get model prediction
        prediction_ = model.predict(img_array)
        confidence = float(prediction_[0][0])
        prediction = "Fracture" if confidence > 0.5 else "No Fracture"

        # Perform fracture detection if fracture is predicted
        if prediction == "Fracture":
            # Convert PIL image to OpenCV format
            img_cv = cv2.cvtColor(np.array(original_img), cv2.COLOR_RGB2BGR)
            
            # Detect fracture areas
            marked_image, fracture_data = detect_fracture_area(img_cv)
            
            # Save marked image
            marked_filename = f"marked_image.jpg"
            marked_path = os.path.join(app.config['UPLOAD_FOLDER'], marked_filename)
            cv2.imwrite(marked_path, marked_image)
            
            # Generate PDF report
            pdf_buffer = generate_pdf_report(
                prediction,
                confidence * 100,
                fracture_data,
                file_path,
                marked_path
            )
            
            # Save PDF
            pdf_filename = f"fracture_report.pdf"
            pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], pdf_filename)
            with open(pdf_path, 'wb') as f:
                f.write(pdf_buffer.getvalue())
            
            response_data = ({
            "prediction": prediction,
            "confidence": round(confidence * 100, 2),
            "marked_image": f"/static/uploads/{marked_filename}",
            "pdf_report": f"/static/uploads/{pdf_filename}",
            "fracture_data": fracture_data
            })
        else:
            # Temp data for non-fracture cases
            response_data = {
                "prediction": prediction,
                "confidence": round(confidence * 100, 2),
                "message": "No fracture detected. The bone structure appears normal.",
                "advice": "If you have concerns, consult a doctor for further analysis."
            }
        return jsonify(response_data)

    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/static/uploads/<filename>')
def download_file(filename):
    return send_from_directory('static/uploads', filename, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)