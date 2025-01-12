from PIL import Image
import os

# Paths
input_path = "src/assets/original/S_80.jpg"
output_directory = "src/assets/resized"
output_path = os.path.join(output_directory, "S_80_resized.jpg")

# Ensure the output directory exists
os.makedirs(output_directory, exist_ok=True)

# Resize the image
try:
    image = Image.open(input_path)
    image_resized = image.resize((224, 224))  # Resize to 224x224 pixels
    image_resized.save(output_path)
    print(f"Image resized and saved to {output_path}")
except FileNotFoundError:
    print(f"File not found: {input_path}")
except Exception as e:
    print(f"An error occurred: {e}")
