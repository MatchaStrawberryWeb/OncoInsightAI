from .file_utils import extract_color_histogram
import joblib

# Path to the image
image_path = "C:/Users/naima/Downloads/OncoInsightAI/src/assets/original/S_80.jpg"

# Path to the model
model_path = "C:/Users/naima/Downloads/OncoInsightAI/models/breast_cancer_model.pkl"

try:
    # Extract features using the color histogram function
    features = extract_color_histogram(image_path)
    print("Extracted Features:", features)
    print(f"Number of features: {len(features)}")

    # Load the trained RandomForestClassifier
    model = joblib.load(model_path)

    # Predict using the extracted features
    prediction = model.predict([features])
    print(f"Prediction: {'Malignant' if prediction[0] == 4 else 'Benign'}")

except ValueError as e:
    print(f"Error processing the image: {e}")
except FileNotFoundError as e:
    print(f"Error: The file was not found. Please check the paths for the image and model: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
