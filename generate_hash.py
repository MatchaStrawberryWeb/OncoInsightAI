from passlib.hash import bcrypt

# Function to generate a hashed password
def generate_hashed_password(plaintext_password):
    # Generate a hashed password using bcrypt
    hashed_password = bcrypt.hash(plaintext_password)
    return hashed_password

# List of usernames
usernames = [
    "admin", "doctor02", "nurse02", "doctor03", "nurse03", 
    "doctor04", "nurse04", "doctor05", "nurse05", "doctor06", 
    "nurse06", "doctor07", "nurse07", "doctor08", "nurse08", 
    "doctor09", "nurse09", "doctor10", "nurse10", "doctor11", 
    "nurse11", "doctor12", "nurse12"
]

# Generate hashed passwords for each username
hashed_passwords = {username: generate_hashed_password(username) for username in usernames}

# Print the hashed passwords
for username, hashed_password in hashed_passwords.items():
    print(f"Username: {username} => Hashed Password: {hashed_password}")
