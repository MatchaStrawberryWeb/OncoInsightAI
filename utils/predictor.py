import numpy as np
from PIL import Image
from tensorflow.keras.applications.vgg16 import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input


# Load the pretrained VGG16 model (without top classification layer)
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

def extract_features(image_array):
    """
    Extract features from the image using a pretrained CNN model.
    This will give us a fixed number of features for RandomForestClassifier.
    """
    # Pass the image through the pretrained CNN
    features = base_model.predict(image_array)
    
    # Flatten the output of the CNN model to feed into RandomForest
    features = features.flatten()
    
    return features

def preprocess_image(file, target_size=(224, 224)):
    """
    Preprocess the uploaded image by resizing it to the target size and normalizing pixel values.

    Args:
        file: File-like object representing the uploaded image.
        target_size (tuple): Desired size for the image (width, height).

    Returns:
        numpy.ndarray: Preprocessed image as a NumPy array, ready for prediction.
    """
    image = Image.open(file).resize(target_size)

    # Ensure the image is in RGB mode to add 3 color channels
    image = image.convert("RGB")

    image_array = np.array(image) / 255.0  # Normalize pixel values

    # Flatten the image to match the RandomForestClassifier input shape (1, n_features)
    flattened_image = image_array.flatten().reshape(1, -1)  # Flatten the image to a 1D array for classification
    
    return flattened_image  # Return flattened image array

def predict_with_models(models, image_array):
    """
    Run predictions on the preprocessed image using multiple models.
    The image_array should now be a 2D array of features.
    """
    results = {}
    for cancer_type, model in models.items():
        prediction = model.predict(image_array)
        
        # Assuming the RandomForestClassifier outputs probabilities (0 to 1)
        diagnosis = "Malignant" if prediction[0] > 0.5 else "Benign"
        confidence = float(prediction[0])  # Convert the prediction to a float
        
        results[cancer_type] = {"diagnosis": diagnosis, "confidence": confidence}
    return results
