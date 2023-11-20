from fastapi import APIRouter, Response
import pytz
import mysql.connector
router = APIRouter(
    prefix="/v1/data",
    tags= "data"
)

mydb = mysql.connector.connect(
    host="localhost",
    user="mriojas",
    password="Fischl1432!",
    database="tempdata"
)
#Create a mysql cursor
cursor = mydb.cursor()

#helper array of shorthand months
months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]


@router.get("/testapi/data/new")
def getTestData(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    cursor = mydb.cursor()

    central_tz = pytz.timezone("US/Central")
    current_date_and_time= datetime.now(central_tz)
    current_time = current_date_and_time.strftime("%H:%M:%S")
    timestamp = ""
    if(current_date_and_time.day < 10):
        timestamp = f"0{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    else:
        timestamp = f"{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    
    N = 5
    new_value = round(random.uniform(10,20), N)

    record = (timestamp, new_value)
    sql = "insert into Readings (timestamp, value) values (%s, %s)"
    cursor.execute(sql, record)
    mydb.commit()
    return {"timestamp" : timestamp, "value": new_value}

