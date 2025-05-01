from fastapi import FastAPI, HTTPException, Depends, Request
from pydantic import BaseModel
import mysql.connector
import bcrypt

app = FastAPI()

# Request body model for login
class LoginRequest(BaseModel):
    username: str
    password: str

# User profile model
class UserProfile(BaseModel):
    fullName: str
    username: str
    department: str

@app.post("/login")
async def login(request: LoginRequest):
    username = request.username
    password = request.password

    # Connect to MySQL database
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='oncoinsight'
    )
    cursor = conn.cursor()

    # Retrieve hashed password from the database
    cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
    result = cursor.fetchone()

    if result:
        stored_hash = result[0]
        if bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
            return {"message": "Login successful!"}
        else:
            raise HTTPException(status_code=401, detail="Invalid password")
    else:
        raise HTTPException(status_code=404, detail="User not found")

    conn.close()

@app.get("/profile", response_model=UserProfile)
async def get_profile(username: str):
    # Connect to MySQL database
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='oncoinsight'
    )
    cursor = conn.cursor()

    # Retrieve user profile information from the database
    cursor.execute("SELECT full_name, department FROM users WHERE username = %s", (username,))
    result = cursor.fetchone()

    if result:
        full_name, department = result
        return UserProfile(fullName=full_name, username=username, department=department)
    else:
        raise HTTPException(status_code=404, detail="User not found")

    conn.close()
