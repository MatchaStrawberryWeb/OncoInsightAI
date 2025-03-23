import bcrypt

password = "admin"  # Plaintext password
salt = bcrypt.gensalt()  # Generate a salt (bcrypt handles it internally)
hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

print("Hashed password:", hashed_password.decode('utf-8'))
