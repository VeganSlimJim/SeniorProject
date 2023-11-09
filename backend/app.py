from fastapi import FastAPI, Response
import mysql.connector
import random
from datetime import datetime
import pytz

app = FastAPI()

mydb = mysql.connector.connect(
    host="localhost",
    user="mriojas",
    password="Fischl1432!",
    database="tempdata"
)

months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]


@app.get("/api/data/new")
async def getData(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    cursor = mydb.cursor()

    N = 5
    new_value = round(random.uniform(10,20), N)

    central_tz = pytz.timezone("US/Central")
    current_date_and_time= datetime.now(central_tz)
    current_time = current_date_and_time.strftime("%H:%M:%S")
    timestamp = ""
    if(current_date_and_time.day < 10):
        timestamp = f"0{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    else:
        timestamp = f"{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    
    record = (timestamp, new_value)
    sql = "insert into Readings (timestamp, value) values (%s, %s)"
    cursor.execute(sql, record)
    mydb.commit()

    return {"timestamp" : timestamp, "value": new_value}



    
@app.get("/")
async def rootRoute(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return {"message": "receieved"}

@app.get("/api/data/load")
async def loadInitialData(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    
    cursor = mydb.cursor()

    sql = "select JSON_ARRAYAGG(JSON_OBJECT('timestamp', timestamp, 'value', value)) from Readings"
    cursor.execute(sql)

    results = cursor.fetchall()
    return results


#https://github.com/VeganSlimJim/SeniorProject.git
