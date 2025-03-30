from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from sklearn.metrics import precision_score, recall_score, f1_score

app = FastAPI()

# Allow CORS for frontend integration
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = r"D:\PotatoDie\models\paf1.h5"
MODEL = tf.keras.models.load_model(MODEL_PATH)

# Define class names
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

# Store ground truth and predictions for calculating evaluation metrics
y_true_list = []
y_pred_list = []

@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}

# Helper function to convert file to image array
def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)).convert("RGB"))
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...), ground_truth: int = -1):
    """
    Predicts the class of the uploaded image.

    Parameters:
    - file: The uploaded image file.
    - ground_truth: The actual class label (optional). If provided, will be used to calculate evaluation metrics.
    """
    image = read_file_as_image(await file.read())

    # Preprocess image to match model input size
    img_batch = np.expand_dims(image, axis=0)

    # Make prediction
    predictions = MODEL.predict(img_batch)
    predicted_class_idx = np.argmax(predictions[0])
    predicted_class = CLASS_NAMES[predicted_class_idx]
    confidence = np.max(predictions[0])

    # If ground truth is provided, store it for metric calculations
    if ground_truth in range(len(CLASS_NAMES)):  # Ensure it's a valid class index
        y_true_list.append(ground_truth)
        y_pred_list.append(predicted_class_idx)

    # Compute precision, recall, and F1-score only if we have enough data
    if len(y_true_list) > 1:
        precision = precision_score(y_true_list, y_pred_list, average='weighted', zero_division=1)
        recall = recall_score(y_true_list, y_pred_list, average='weighted', zero_division=1)
        f1 = f1_score(y_true_list, y_pred_list, average='weighted', zero_division=1)
    else:
        precision, recall, f1 = None, None, None  # Not enough data for meaningful metrics

    return {
        "class": predicted_class,
        "confidence": float(confidence),
        "precision": float(precision) if precision is not None else "N/A",
        "recall": float(recall) if recall is not None else "N/A",
        "f1_score": float(f1) if f1 is not None else "N/A"
    }

# Run the FastAPI server
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
