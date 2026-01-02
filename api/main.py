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
from database.db import SessionLocal, engine
from database.models import Prediction
from database.db import Base

app = FastAPI()

# 🔥 CREATE DB TABLES (runs once automatically)
Base.metadata.create_all(bind=engine)

origins = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "../models/paf1.h5"
MODEL = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    # 🔥 READ IMAGE
    image_bytes = await file.read()
    image = read_file_as_image(image_bytes)
    img_batch = np.expand_dims(image, 0)

    predictions = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = float(np.max(predictions[0]))

    # 🔥 SAVE IMAGE TO uploads/
    os.makedirs("uploads", exist_ok=True)
    filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    image_path = os.path.join("uploads", filename)

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
        'class': predicted_class,
        'confidence': confidence,
        'image_path': image_path
    }

# 🔥 OPTIONAL BUT STRONG FOR VIVA
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

if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000)
