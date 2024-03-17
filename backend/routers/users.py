from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
import pytz
import mysql.connector
import random
from datetime import datetime, timedelta
import uuid
from models.users import User, DeletedUser, UpdatedUser
from models.tokens import JWTTOKEN
import jwt
from functions.encryption import encrypt_password, verify_password
import jwt
JWT_SECRET='a42d46793ee7d56a31745ae170021cb48f1034932d6cc30f289c655451438b27'
JWT_ALGORITHM="HS256"

user_router = APIRouter()

mydb = mysql.connector.connect(
    host="localhost",
    user="mriojas",
    password="Fischl1432!",
    database="tempdata"
)

cursor = mydb.cursor()

months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]


@user_router.post("/create")
def create_user(user: User, response: JSONResponse):
    

    #check if user exists
    sql = f"select * from Users where email='{user.email}'"
   
    cursor.execute(sql)
    res = cursor.fetchall()

    # if an acc with that email alr exists
    if(len(res) > 0):
        data = {
            "Error" : "A user with that email already exists"
        }
        headers = {"Access-Control-Allow-Origin":  "*"}
        return JSONResponse(content=data, headers=headers, status_code=409)
    
    central_tz = pytz.timezone("US/Central")
    current_date_and_time= datetime.now(central_tz)
    current_time = current_date_and_time.strftime("%H:%M:%S")
    timestamp = ""
    if(current_date_and_time.day < 10):
        timestamp = f"0{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    else:
        timestamp = f"{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    
    #uuid creation
    user.user_id = str(uuid.uuid4())
    user.creation_date = timestamp

    hashed_pw = encrypt_password(user.password)
    record = (user.user_id, hashed_pw, user.email, user.first_name, user.last_name, user.creation_date)
    sql = "insert into Users (user_id, password, email, first_name, last_name, creation_date) values (%s,%s,%s,%s,%s,%s)"
    cursor.execute(sql, record)
    mydb.commit()

    # return the payload utilizing the jwt
    payload = {
        'user_id': user.user_id
    }
    jwt_token = jwt.encode(payload=payload, key=JWT_SECRET, algorithm=JWT_ALGORITHM)

    headers = {"Access-Control-Allow-Origin":  "*"}
    data = {
        "token": jwt_token
    }

    return JSONResponse(content=data, headers=headers, status_code=200)
    

@user_router.delete("/delete")
def delete_user(token: JWTTOKEN, response: JSONResponse):
    decoded_jwt = jwt.decode(token.token, key=JWT_SECRET, algorithms=[JWT_ALGORITHM])
    user_id = decoded_jwt["user_id"]
    print(user_id)
    sql = f"select * from Users where user_id='{user_id}'"
    cursor.execute(sql)

    res = cursor.fetchall()

    if(len(res) < 1):
        data = {
            "Error": "No record found for the given user"
        }
        headers = {"Access-Control-Allow-Origin": "*"}
        return JSONResponse(content=data, headers=headers, status_code=404)
    
    
    try:
        delete_sql = f"delete from Users where user_id='{user_id}'"
        cursor.execute(delete_sql)
        mydb.commit()
        data = {"Success!": "Record successfully deleted"}
        headers = {"Access-Control-Allow-Origin": "*"}
        return JSONResponse(content=data,headers=headers, status_code=200)

    #if something goes wrong during the delete
    except Exception as e:
        data = {
            "Error": str(e)
        }
        headers = {"Access-Control-Allow-Origin": "*"}
        return JSONResponse(content=data, headers=headers, status_code=400)


@user_router.put("/update")
def update_user(user: UpdatedUser):
    
    #hold the decoded jwt for where clause purposes
    decoded_jwt = jwt.decode(user.token, key=JWT_SECRET, algorithms=[JWT_ALGORITHM])
    user_id = decoded_jwt["user_id"]
    sql = f"select * from Users where user_id='{user_id}'"

    cursor.execute(sql)
    res = cursor.fetchall()

    if(len(res) < 1):
        data = {
            "Error": "No record found for the given user"
        }
        headers = {"Access-Control-Allow-Origin": "*"}
        return JSONResponse(content=data, headers=headers, status_code=404)
    
    try:

        # hash the password again
        hashed_pw = encrypt_password(user.password)
        update_sql = f"update Users set first_name='{user.first_name}',last_name='{user.last_name}',password='{hashed_pw}',email='{user.email}', user_role='{user.user_role}' where user_id='{user_id}'"
        cursor.execute(update_sql)
        mydb.commit()
        data = {"Success!": "Record successfully updated"}
        headers = {"Access-Control-Allow-Origin": "*"}
        return JSONResponse(content=data,headers=headers, status_code=200)

    #if something goes wrong during the delete
    except Exception as e:
        data = {
            "Error": str(e)
        }
        headers = {"Access-Control-Allow-Origin": "*"}
        return JSONResponse(content=data, headers=headers, status_code=400)

        



    


