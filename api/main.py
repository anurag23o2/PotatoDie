from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os

# -----------------------------
# App init
# -----------------------------
app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# MODEL PATH (MATCHES YOUR ACTUAL FILE)
# D:\PotatoDie\api\models\potato_model.h5
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "potato_model.h5")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

# -----------------------------
# Load model (CPU-safe)
# -----------------------------
model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

# -----------------------------
# In-memory history
# -----------------------------
scan_history = []

# -----------------------------
# Image preprocessing
# -----------------------------
def read_image(file: UploadFile):
    image = Image.open(BytesIO(file.file.read())).convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# -----------------------------
# Predict endpoint
# -----------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_image(file)

    predictions = model.predict(image)
    confidence = float(np.max(predictions))
    class_index = int(np.argmax(predictions))
    class_name = CLASS_NAMES[class_index]

    scan_history.append({
        "id": len(scan_history) + 1,
        "predicted_class": class_name,
        "confidence": confidence,
        "filename": file.filename,
        "timestamp": datetime.now().isoformat()
    })

    return {
        "predicted_class": class_name,
        "confidence": confidence,
        "filename": file.filename
    }

# -----------------------------
# History + analytics endpoint
# -----------------------------
@app.get("/history")
def get_history():
    if not scan_history:
        return {
            "total_scans": 0,
            "highest_score": 0,
            "lowest_score": 0,
            "history": []
        }

    scores = [item["confidence"] for item in scan_history]

    return {
        "total_scans": len(scan_history),
        "highest_score": max(scores),
        "lowest_score": min(scores),
        "history": scan_history
    }
