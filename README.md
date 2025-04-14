[BoneAI_Report.pdf](https://github.com/user-attachments/files/19728426/BoneAI_Report.pdf)# 🦴 Bone Fracture Classifier with Automated Crack Detection & PDF Reporting

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

### 📄 Auto-Generated PDF Report
[Uploadi%PDF-1.4
%���� ReportLab Generated PDF document http://www.reportlab.com
1 0 obj
<<
/F1 2 0 R /F2 3 0 R
>>
endobj
2 0 obj
<<
/BaseFont /Helvetica /Encoding /WinAnsiEncoding /Name /F1 /Subtype /Type1 /Type /Font
>>
endobj
3 0 obj
<<
/BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding /Name /F2 /Subtype /Type1 /Type /Font
>>
endobj
4 0 obj
<<
/Contents 8 0 R /MediaBox [ 0 0 612 792 ] /Parent 7 0 R /Resources <<
/Font 1 0 R /ProcSet [ /PDF /Text /ImageB /ImageC /ImageI ]
>> /Rotate 0 /Trans <<

>> 
  /Type /Page
>>
endobj
5 0 obj
<<
/PageMode /UseNone /Pages 7 0 R /Type /Catalog
>>
endobj
6 0 obj
<<
/Author (\(anonymous\)) /CreationDate (D:20250204153238+05'00') /Creator (\(unspecified\)) /Keywords () /ModDate (D:20250204153238+05'00') /Producer (ReportLab PDF Library - www.reportlab.com) 
  /Subject (\(unspecified\)) /Title (\(anonymous\)) /Trapped /False
>>
endobj
7 0 obj
<<
/Count 1 /Kids [ 4 0 R ] /Type /Pages
>>
endobj
8 0 obj
<<
/Filter [ /ASCII85Decode /FlateDecode ] /Length 824
>>
stream
Gat=j?#Q2d'Sc)J/'cD8G$6ZUHmIZ'rL+pQdaiH,)])3;6neen2#Hr-2JJD]aA!7=&/Lf1om%Wq-kJM>rD,<O=##*;UHf^8),PhB6[TERn`Y6dpNKAF&C)0MN+9edea!f27Ltd(q!\L20OVUD_jDlnEMZ:4=Me@g'A_4@(*tVWNGRN=<3"N9&H@=VWtG5ga*YXQ\-2PPBU`,YS_alSMOJ=CJgr!QKEYl&`l&*#6lq9!R8_M>MZ$CmNXl=NZp&*Qa3d#=[a:",2OK5kTBNI^Ub^?G9_5Bu:6Ep']Z@K11RX+U&J<6>8O1!L-%,_\qZ;)(E3F[K6??:;MZ87f1>pI`&9C[@Og?tF5$`M(Vc1*,$1Dn<?+`XO"8N-_49oD>ku8&r?ssclj^/EI+Cp)f<q96)m^<9$d',k*p`L[KiLf2KpRLQl#GEkrBP[Y[VaC"KU&!cEd)]$W]$S*26hBG-kr9/i(8.*P1iF/$#gEb&;=D3J%jFl?N@7`[=nh9;5[e<77"nV"%KPX]n,a6P_Bmil!j9W;RgkK@/IZ6(nY0P$<NEMYf<?!1SSM%Z<4-BX""jAr\H&44+u*::Y6B,R)%>&d.LNS;[XtX23UdZ0kZh,b2:,;HOh?d8EuS`I_UflX>;PcFVt6!:s4fPI8Ea=(N_J:\+0Y,LbFc6S&]D3ha*\YiR+@%`r+Tf&j&\XTCUDaP71)blg*25KBm:7K@RRdc]ki3d-?6LS!.[&198.`5";\tBmgeDam*Y$coA!e.15Rl/_$ce](^jrQ1/&/)iC*j:9bH,]+,Ysm?F1_W`g=[n28Z1;]q3+)+7MWhO8~>endstream
endobj
xref
0 9
0000000000 65535 f 
0000000073 00000 n 
0000000114 00000 n 
0000000221 00000 n 
0000000333 00000 n 
0000000526 00000 n 
0000000594 00000 n 
0000000877 00000 n 
0000000936 00000 n 
trailer
<<
/ID 
[<edbe3102a5bd93a6f140a9e86582ad4c><edbe3102a5bd93a6f140a9e86582ad4c>]
% ReportLab generated PDF document -- digest (http://www.reportlab.com)

/Info 6 0 R
/Root 5 0 R
/Size 9
>>
startxref
1850
%%EOF
ng BoneAI_Report.pdf…]()

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
