from fastapi import APIRouter
from fastapi.responses import JSONResponse
import mysql.connector
from models.auth import UserLogin
from functions.encryption import encrypt_password, verify_password
import jwt
JWT_SECRET='a42d46793ee7d56a31745ae170021cb48f1034932d6cc30f289c655451438b27'
JWT_ALGORITHM="HS256"
auth_router = APIRouter()

mydb = mysql.connector.connect(
    host="localhost",
    user="mriojas",
    password="Fischl1432!",
    database="tempdata"
)
#Create a mysql cursor
cursor = mydb.cursor()


@auth_router.post("/login")
def login(user: UserLogin):
    print(user)
    #check for valid login
    print(user.email)
    sql = f"select * from Users where email='{user.email}'"
    cursor.execute(sql)

    res = cursor.fetchall()
    print(res)
    if(len(res) < 1):
        data = {
            "Error": "No record found for the given user"
        }
        headers = {"Access-Control-Allow-Origin": "*"}
        return JSONResponse(content=data, headers=headers, status_code=404)
    
    # get the hashed pw from the database
    hashed_pw = res[0][1]
    user_role = res[0][6]
    print("im here")


    if(verify_password(user.password, hashed_pw)):
        
        # if theres a verify then the user is the same lul
        user_id = res[0][0]
        payload = {
            "user_id": user_id
        }
        token = jwt.encode(payload=payload, key=JWT_SECRET, algorithm=JWT_ALGORITHM)    
        
        data = {
            "token": token,
            "user_role": user_role
        }
        headers = {"Access-Control-Allow-Origin": "*"}
        return JSONResponse(content=data, headers=headers, status_code=200)
    else:
        data = {
            "Error" : "Incorrect password or username entered"
        }
        headers = {"Access-Control-Allow-Origin" : "*"}
        return JSONResponse(content=data, headers=headers, status_code=401)

            



    
