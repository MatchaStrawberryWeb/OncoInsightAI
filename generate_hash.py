from passlib.hash import bcrypt

def generate_hashed_password(plaintext_password):
    # Generate a hashed password using bcrypt
    hashed_password = bcrypt.hash(plaintext_password)
    return hashed_password

# Example usage
plaintext_password = "doctor02"
hashed_password = generate_hashed_password(plaintext_password)
print(f"Generated hash: {hashed_password}")
