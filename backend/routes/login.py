from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
import bcrypt

app = FastAPI()

# Request body model for login
class LoginRequest(BaseModel):
    username: str
    password: str

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
