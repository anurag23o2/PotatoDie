from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

# 🔥 ADDED IMPORTS
import os
from datetime import datetime
from sqlalchemy import func

from database.db import SessionLocal, engine, Base
from database.models import Prediction

app = FastAPI()

# 🔥 CREATE DB TABLES
Base.metadata.create_all(bind=engine)

# CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 SAFE, DEPLOYMENT-PROOF MODEL PATH
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "paf1.h5")

MODEL = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]


@app.get("/ping")
async def ping():
    return "Hello, I am alive"


def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = read_file_as_image(image_bytes)
    img_batch = np.expand_dims(image, 0)

    predictions = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = float(np.max(predictions[0]))

    # 🔥 SAVE IMAGE
    uploads_dir = os.path.join(BASE_DIR, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    image_path = os.path.join(uploads_dir, filename)

    with open(image_path, "wb") as f:
        f.write(image_bytes)

    # 🔥 SAVE TO DATABASE
    db = SessionLocal()
    entry = Prediction(
        image_path=image_path,
        predicted_class=predicted_class,
        confidence=confidence
    )
    db.add(entry)
    db.commit()
    db.close()

    return {
        "class": predicted_class,
        "confidence": confidence,
        "image_path": image_path
    }


@app.get("/history")
def get_history():
    db = SessionLocal()
    data = db.query(Prediction).all()
    db.close()

    return [
        {
            "id": d.id,
            "image_path": d.image_path,
            "class": d.predicted_class,
            "confidence": d.confidence,
            "timestamp": d.created_at
        }
        for d in data
    ]


# =======================
# 🔥 ANALYTICS ENDPOINTS
# =======================

@app.get("/analytics/summary")
def analytics_summary():
    db = SessionLocal()

    total = db.query(func.count(Prediction.id)).scalar()
    avg_conf = db.query(func.avg(Prediction.confidence)).scalar()
    min_conf = db.query(func.min(Prediction.confidence)).scalar()
    max_conf = db.query(func.max(Prediction.confidence)).scalar()

    db.close()

    return {
        "total_predictions": total,
        "average_confidence": round(avg_conf, 4) if avg_conf else None,
        "min_confidence": round(min_conf, 4) if min_conf else None,
        "max_confidence": round(max_conf, 4) if max_conf else None
    }


@app.get("/analytics/class-distribution")
def class_distribution():
    db = SessionLocal()

    results = (
        db.query(
            Prediction.predicted_class,
            func.count(Prediction.id)
        )
        .group_by(Prediction.predicted_class)
        .all()
    )

    total = sum(r[1] for r in results)
    db.close()

    return [
        {
            "class": r[0],
            "count": r[1],
            "percentage": round((r[1] / total) * 100, 2) if total else 0
        }
        for r in results
    ]


@app.get("/analytics/confidence-levels")
def confidence_levels():
    db = SessionLocal()

    high = db.query(Prediction).filter(Prediction.confidence >= 0.8).count()
    medium = db.query(Prediction).filter(
        Prediction.confidence >= 0.6,
        Prediction.confidence < 0.8
    ).count()
    low = db.query(Prediction).filter(Prediction.confidence < 0.6).count()

    db.close()

    return {
        "high_confidence": high,
        "medium_confidence": medium,
        "low_confidence": low
    }


@app.get("/analytics/daily-usage")
def daily_usage():
    db = SessionLocal()

    results = (
        db.query(
            func.date(Prediction.created_at),
            func.count(Prediction.id)
        )
        .group_by(func.date(Prediction.created_at))
        .order_by(func.date(Prediction.created_at))
        .all()
    )

    db.close()

    return [
        {
            "date": str(r[0]),
            "count": r[1]
        }
        for r in results
    ]


# ==================================================
# 🔥 QUICK ANALYSIS (ONLY ADDITION BELOW)
# ==================================================

@app.get("/analytics/quick-summary")
def quick_analysis_summary():
    db = SessionLocal()

    total_scans = db.query(func.count(Prediction.id)).scalar()
    highest_score = db.query(func.max(Prediction.confidence)).scalar()
    lowest_score = db.query(func.min(Prediction.confidence)).scalar()

    most_predicted = (
        db.query(
            Prediction.predicted_class,
            func.count(Prediction.id).label("count")
        )
        .group_by(Prediction.predicted_class)
        .order_by(func.count(Prediction.id).desc())
        .first()
    )

    # 🔥 NEW: LATEST PREDICTED CLASS (ONLY ADDITION)
    latest_prediction = (
        db.query(Prediction.predicted_class)
        .order_by(Prediction.created_at.desc())
        .first()
    )

    db.close()

    return {
        "total_scans": total_scans or 0,
        "highest_score": round(highest_score, 4) if highest_score else 0,
        "lowest_score": round(lowest_score, 4) if lowest_score else 0,
        "most_predicted_class": most_predicted[0] if most_predicted else None,
        "latest_predicted_class": latest_prediction[0] if latest_prediction else None
    }


# 🔥 RENDER-COMPATIBLE SERVER START
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("api.main:app", host="0.0.0.0", port=port)
