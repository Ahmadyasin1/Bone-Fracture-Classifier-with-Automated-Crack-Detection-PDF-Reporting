# 🦴 Bone Fracture Classifier with Automated Crack Detection & PDF Reporting

![Python](https://img.shields.io/badge/Python-3.10-blue)
![TensorFlow](https://img.shields.io/badge/TensorFlow-DeepLearning-orange)
![OpenCV](https://img.shields.io/badge/OpenCV-ImageProcessing-red)
![ReportLab](https://img.shields.io/badge/PDF-AutoReport-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

An advanced AI-powered system to detect **bone fractures** from X-ray images using deep learning — with **crack localization**, **visual annotations**, and **auto-generated diagnostic PDF reports**.

🧠 **Built for radiologists, healthcare AI researchers, and real-time clinical integrations**.

---

## 🚀 Live Demo (Coming Soon)

https://ahmadyasin.vercel.app/projects/bone-fracture-detection

---

## 🔍 Key Features

- 🩻 Detects presence of fractures in bone X-rays
- 🔬 Uses **deep convolutional neural networks (CNNs)** for classification
- 📌 Highlights **fracture/crack zones** with bounding boxes or heatmaps
- 📄 Generates downloadable **PDF reports** with:
  - Patient info
  - Fracture prediction
  - Annotated X-ray image
  - Model confidence
  - Timestamp & branding
- 🌐 Extendable for multi-class fracture classification (e.g., simple, compound)

---

## 🧠 Model Architecture

- 🔸 CNN Base: ResNet50 / EfficientNetB0 (transfer learning)
- 🔸 Custom classifier head
- 🔸 Trained on labeled bone X-ray datasets
- 🔸 Crack localization via Grad-CAM or object detection (YOLOv5)

---

## 🛠️ Tech Stack

| Component        | Technology               |
|------------------|---------------------------|
| 🧠 Deep Learning | TensorFlow / Keras        |
| 📸 Image Processing | OpenCV, PIL           |
| 📊 Visualization | Matplotlib, Seaborn       |
| 📄 PDF Reporting | ReportLab / FPDF / PyMuPDF |
| 🖥️ Deployment | Flask / Streamlit / FastAPI |

---

## 📂 Dataset

- **Type**: Bone X-ray images (e.g., wrist, elbow, ankle)
- **Format**: JPG/PNG images
- **Labels**: `fractured`, `non-fractured`
- **Crack Annotations**: Bounding boxes, masks (for advanced use)

> ✅ Custom-trained dataset or public datasets like [MURA](https://stanfordmlgroup.github.io/competitions/mura/)

---

## 🖼️ Sample Outputs

### ✅ Original X-ray
![OIP (6)](https://github.com/user-attachments/assets/adeea5f2-706c-4290-abe4-fb778187b3d1)

### 📌 Fracture Localized
![image](https://github.com/user-attachments/assets/2fb7f2ba-1f4a-46ba-90a8-e28b9ae65ed0)

---

## 📄 Sample Report

**Report Includes:**
- 🏷️ Patient Name & ID
- 📅 Timestamp
- 🧠 Fracture Prediction (e.g., "Fractured – High Confidence")
- 🖼️ Annotated X-ray Image
- 📈 Model Confidence Score
- ✅ Signature line for radiologist

📈 Evaluation Metrics
Accuracy

AUC-ROC

Precision / Recall / F1-Score

Confusion Matrix

Grad-CAM visualization for interpretability

---

## 🧪 Example Usage (CLI)
python predict.py --image xray_sample.png --patient "Ahmad Yasin" --id 00123
Output:
✅ Fracture Detected with 94.7% Confidence
📄 Report saved to reports/00123_report.pdf

---

## 🔮 Future Enhancements
🔍 Integrate object detection for precise crack bounding boxes

📱 Build mobile camera interface (e.g., Android app)

🧠 Model explainability via SHAP

🌐 REST API (FastAPI) for remote diagnosis

🧾 Multi-language report generation

---

## 🤝 Contributing
We welcome all contributions to improve accuracy, visuals, UX, and performance.

Steps:

Fork the repo

Create your feature branch

Submit a PR after testing

---

## 👤 Author
Ahmad Yasin
📧 AhmadYasin.info@gmail.com
🔗 LinkedIn www.linkedin.com/in/mian-ahmad-yasin 
🌐 https://ahmadyasin.vercel.app/

---

## ⭐ Support
If this project helped you or you found it interesting, feel free to ⭐ star the repo and share!

---

## ⚙️ How to Run Locally

```bash
# Step 1: Clone the Repository
git clone https://github.com/your-username/bone-fracture-classifier.git
cd bone-fracture-classifier

# Step 2: Create Virtual Environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Step 3: Install Dependencies
pip install -r requirements.txt

# Step 4: Run Inference
python predict.py --image path/to/xray.jpg
