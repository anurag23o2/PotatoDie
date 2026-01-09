from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

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
# Load model
# -----------------------------
MODEL_PATH = "models/potato_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

# -----------------------------
# GLOBAL HISTORY STORAGE
# -----------------------------
scan_history = []

# -----------------------------
# Utility: read image
# -----------------------------
def read_image(file: UploadFile):
    image = Image.open(BytesIO(file.file.read()))
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# -----------------------------
# PREDICT ENDPOINT
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
# HISTORY + ANALYTICS ENDPOINT
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
