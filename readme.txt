
# 🥔 Potato Disease Classifier (PotatoDie)

An end-to-end deep learning project that detects potato plant diseases using image classification.
This project leverages Convolutional Neural Networks (CNN) to classify potato leaves into **Early Blight, Late Blight, and Healthy** categories.

---

## 📌 Overview

Crop diseases significantly affect agricultural productivity. This project aims to build an automated system that helps farmers and researchers identify potato diseases quickly and accurately.

The model is trained on the **PlantVillage dataset** and deployed as a web application for real-time predictions.

---

## ⚙️ Tech Stack

* **Language:** Python
* **Libraries:** TensorFlow, Keras, NumPy, Pandas
* **Visualization:** Matplotlib
* **Backend:** FastAPI
* **Deployment:** Netlify (Frontend)
* **Dataset:** PlantVillage (Kaggle)

---

## 📊 Dataset

* Total Images: 2152

* Classes:

  * Early Blight (1000)
  * Late Blight (1000)
  * Healthy (152)

* Data Split:

  * Train: 80%
  * Validation: 10%
  * Test: 10%

---

## 🔄 Data Preprocessing

* Image resizing and normalization
* Data augmentation:

  * Horizontal Flip
  * Random Rotation (0.1)
  * Random Zoom (0.1)

---

## 🧠 Model Architecture

* Convolutional Neural Network (CNN)
* Layers:

  * Conv2D + ReLU
  * MaxPooling
  * Dropout
  * Fully Connected Dense Layers

---

## 📈 Results

* **Accuracy:** 98.99%
* **Loss:** 0.0176

The model demonstrates high performance in detecting potato diseases with minimal error.

---

## 🌐 Deployment

The model is deployed as a web application using FastAPI backend.

🔗 Live App: https://potatodieleafs.vercel.app/

---

## 📷 Sample Predictions

* Upload an image of a potato leaf
* Model predicts disease class instantly

---

## 🚀 How to Run Locally

```bash
# Clone repository
git clone https://github.com/anurag23o2/PotatoDie.git

# Navigate to project
cd PotatoDie

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload
```

---

## 📌 Features

* Real-time disease prediction
* Clean UI for easy interaction
* High accuracy deep learning model
* End-to-end pipeline (training → deployment)

---

## 📉 Limitations

* Works only on potato leaf images
* Performance depends on image quality
* Limited dataset diversity

---

## 🔮 Future Improvements

* Add more crop diseases
* Improve dataset size and diversity
* Mobile app integration
* Real-time field detection using IoT

---

## 👨‍💻 Author

**Anurag Mishra**

* Machine Learning & Data Science Enthusiast
* Focused on real-world problem solving

---

## ⭐ If you like this project

Give it a star on GitHub and share it 🚀
