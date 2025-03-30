from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from sklearn.metrics import confusion_matrix, precision_score, accuracy_score, f1_score
import os

app = FastAPI()

origins = ["http://localhost", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model(r"D:\PotatoDie\saved_models\1\5.h5")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
VALIDATION_DIR = r"D:\PotatoDie\validation_data"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

def load_validation_data(directory):
    images = []
    labels = []
    for class_idx, class_name in enumerate(CLASS_NAMES):
        class_dir = os.path.join(directory, class_name.lower().replace(" ", "_"))
        if not os.path.exists(class_dir):
            print(f"Warning: Directory {class_dir} does not exist.")
            continue
        for filename in os.listdir(class_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                img_path = os.path.join(class_dir, filename)
                try:
                    with open(img_path, 'rb') as f:
                        img = read_file_as_image(f.read())
                        images.append(img)
                        labels.append(class_idx)
                except Exception as e:
                    print(f"Error loading image {img_path}: {e}")
    return np.array(images), np.array(labels)

# Load and evaluate validation data at startup
val_images, val_labels = load_validation_data(VALIDATION_DIR)

# Initialize metrics with default values if no validation data
conf_matrix = None
precision = 0.0
accuracy = 0.0
f1 = 0.0

if val_images.size > 0:  # Check if we have any validation images
    val_images_batch = np.expand_dims(val_images, axis=0)  # Adjust shape as needed
    try:
        val_predictions = MODEL.predict(val_images_batch)
        val_pred_labels = np.argmax(val_predictions, axis=1)
        
        # Calculate metrics
        conf_matrix = confusion_matrix(val_labels, val_pred_labels)
        precision = precision_score(val_labels, val_pred_labels, average='weighted', zero_division=0)
        accuracy = accuracy_score(val_labels, val_pred_labels)
        f1 = f1_score(val_labels, val_pred_labels, average='weighted', zero_division=0)
    except Exception as e:
        print(f"Error during prediction or metric calculation: {e}")
else:
    print("No validation images found. Metrics will be set to default values.")

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

@app.get("/metrics")
async def get_metrics():
    return {
        "confusion_matrix": conf_matrix.tolist() if conf_matrix is not None else None,
        "precision": float(precision),
        "accuracy": float(accuracy),
        "f1_score": float(f1)
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    predictions = MODEL.predict(img_batch)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence),
        'accuracy': float(accuracy),   # Add Accuracy
        'precision': float(precision), # Add Precision
        'f1_score': float(f1)          # Add F1-Score
    }

        
    

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)