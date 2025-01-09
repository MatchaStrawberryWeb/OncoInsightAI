import mysql.connector
import bcrypt

# Function to handle the login process
def login(username, plaintext_password):
    # Connect to your MySQL database
    conn = mysql.connector.connect(
        host='localhost',           
        user='root',      
        password='',
        database='oncoinsight'  
    )

    cursor = conn.cursor()

    # Retrieve the hashed password for the given username from the database
    cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
    result = cursor.fetchone()

    if result:
        stored_hash = result[0]  # This returns the hashed password from the database

        # Check if the entered password matches the stored hash
        if bcrypt.checkpw(plaintext_password.encode('utf-8'), stored_hash.encode('utf-8')):
            print("Login successful!")
        else:
            print("Login failed. Incorrect password.")
    else:
        print(f"User '{username}' not found in the database.")

    # Close the connection
    conn.close()

# Get username and password from user input
username = input("Enter your username: ")
plaintext_password = input("Enter your password: ")

# Call the login function
login(username, plaintext_password)
