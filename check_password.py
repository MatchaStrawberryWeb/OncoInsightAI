import mysql.connector
import bcrypt

# Connect to your MySQL database
conn = mysql.connector.connect(
    host='localhost',  # Replace with your database host if different
    user='root',  # Your database username
    password='',  # Your database password
    database='oncoinsight'  # Replace with your database name
)

cursor = conn.cursor()

# Get the username and password to check from the user
username = input("Enter your username: ")
plaintext_password = input("Enter your password: ")

# Retrieve the hashed password for the given username from the database
cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
result = cursor.fetchone()

if result:
    stored_hash = result[0]  # This is the hashed password stored in the database

    # Check if the entered password matches the stored hash
    if bcrypt.checkpw(plaintext_password.encode('utf-8'), stored_hash.encode('utf-8')):
        print("Login successful!")
    else:
        print("Login failed. Incorrect password.")
else:
    print(f"User '{username}' not found in the database.")

# Close the connection
conn.close()
