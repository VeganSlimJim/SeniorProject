from fastapi import APIRouter, Response, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
import jwt
import pytz
import mysql.connector
import random
from datetime import datetime
from pymodbus.client import ModbusTcpClient as client
from models.data import ReportReading, Panel, PanelPost
import struct

JWT_SECRET='a42d46793ee7d56a31745ae170021cb48f1034932d6cc30f289c655451438b27'
JWT_ALGORITHM="HS256"

data_router = APIRouter()

#implement oauth2 to protect this endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

# route for getting a test value of a plc reading
@data_router.get("/testnew")
def getTestData(token: str = Depends(oauth2_scheme)):
    cursor = mydb.cursor()

    try:
        #decode the payload
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM] )
        user_id = payload["user_id"]
        
        # see if the user exists
        test_user_sql = f"select * from Users where user_id='{user_id}'"
        cursor.execute(test_user_sql)
        res = cursor.fetchall()
        #if the user does not exist in the database
        if(len(res) < 1):
            data = {"Error": "Invalid User"}
            headers = {"Access-Control-Allow-Origin" : "*"}
            return JSONResponse(content=data, headers=headers, status_code=401)
    
    except Exception as e:
        data = {
            "Error": str(e)
        }
        headers={"Access-Control-Allow-Origin":"*"}
        return JSONResponse(content=data, headers=headers, status_code=401)
    
    #continue on as planned

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
    data = {"timestamp" : timestamp, "value": new_value}
    headers = {"Access-Control-Allow-Origin": "*"}
    return JSONResponse(content=data, headers=headers,status_code=200)

#GET route for retrieving a reading from the PLC
@data_router.get("/new")
async def getData(response: Response):
    #Add this response header so we don't get bullied by CORS
    response.headers["Access-Control-Allow-Origin"] = "*"

    
    

    #Get the central timezone
    central_tz = pytz.timezone("US/Central")
    #get the time based on the given timezone
    current_date_and_time= datetime.now(central_tz)
    #get the time in HOUR:MINUTE:SECOND format
    current_time = current_date_and_time.strftime("%H:%M:%S")

    #massage the timestamp to look like how we want it to
    timestamp = ""
    if(current_date_and_time.day < 10):
        timestamp = f"0{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    else:
        timestamp = f"{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    

    PLC = client(host='192.168.1.239',port=502)
    PLC.connect()
    result = PLC.read_coils(8193,5)
    #rr = PLC.read_holding_registers(65536,1)
    #PLC has 16bit registers
    request = PLC.read_holding_registers(28672,3)
    now = datetime.now()
    print(request.registers)
    #print(bin(request.registers[0])[2:])  #[2:] gets rid of first 0b
    #print(bin(request.registers[1])[2:])
    LS1 = [int(num) for num in bin(request.registers[0])[2:]] #convert string of binary number into list of integers
    #print(LS1)
    LS1 = convert(LS1)
    #print(LS1)
    LS2 = [int(num) for num in bin(request.registers[1])[2:]]
    LS2 = convert(LS2)
    #bit_32= LS1 + LS2
    bit_32_RTL = LS2 + LS1
    PLC.close()

    p = bits_to_float(bit_32_RTL)
    p=20*(p/100)

    #Round the given value to 5 decimal places
    N = 5
    new_value = round(p, N)
    record = (timestamp, new_value)
    #Execute the mysql insert
    sql = "insert into Readings (timestamp, value) values (%s, %s)"
    cursor.execute(sql, record)
    #Commit the result
    mydb.commit()
    #Return the json
    return {"timestamp" : timestamp, "value": new_value}

# route for getting a test value of a plc reading
@data_router.post("/testnewreportreading")
def getTestDataForReport(data_payload: ReportReading, token: str = Depends(oauth2_scheme)):
    cursor = mydb.cursor()
    phase = data_payload.phase

    try:
        #decode the payload
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM] )
        user_id = payload["user_id"]
        
        # see if the user exists
        test_user_sql = f"select * from Users where user_id='{user_id}'"
        cursor.execute(test_user_sql)
        res = cursor.fetchall()
        #if the user does not exist in the database
        if(len(res) < 1):
            data = {"Error": "Invalid User"}
            headers = {"Access-Control-Allow-Origin" : "*"}
            return JSONResponse(content=data, headers=headers, status_code=401)
    
    except Exception as e:
        data = {
            "Error": str(e)
        }
        headers={"Access-Control-Allow-Origin":"*"}
        return JSONResponse(content=data, headers=headers, status_code=401)
    
    #continue on as planned

    central_tz = pytz.timezone("US/Central")
    current_date_and_time= datetime.now(central_tz)
    current_time = current_date_and_time.strftime("%H:%M:%S")
    timestamp = ""
    if(current_date_and_time.day < 10):
        timestamp = f"0{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    else:
        timestamp = f"{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    
    N = 5
    rand_amps = round(random.uniform(10,20), N)
    
    
    #Calculate the equivalent value using the function
    kw_capacity_reading = kw_capacity(int(phase), rand_amps)
    record = (timestamp, rand_amps, phase, kw_capacity_reading)
    sql = "insert into ReportReadings (timestamp, amps, phase, kw_capacity) values (%s, %s, %s, %s)"
    cursor.execute(sql, record)
    mydb.commit()
    data = {"timestamp" : timestamp, "value": rand_amps, "phase": phase, "kw_capacity_reading": kw_capacity_reading}
    headers = {"Access-Control-Allow-Origin": "*"}
    return JSONResponse(content=data, headers=headers,status_code=200)


@data_router.get("/panels/get-all")
async def getAllPanels(response: JSONResponse):

    try:
        cursor = mydb.cursor(dictionary=True)

        sql = "select * from Panels"

        cursor.execute(sql)

        res = cursor.fetchall()
        
        headers = {"Access-Control-Allow-Origin":  "*"}
        data = {
            "data": res 
        }
        cursor.close()

        return JSONResponse(content=data, headers=headers, status_code=200)
    
    except Exception as e:
        headers = {"Access-Control-Allow-Origin":  "*"}

        data = {
            "Error": str(e)
        }
        cursor.close()

        return JSONResponse(content=data, headers=headers, status_code=400)

        
        


@data_router.get("/panels/get")
async def getPanels(response: JSONResponse):


    try:

        cursor = mydb.cursor()

        sql = "select name from Panels"

        cursor.execute(sql)

        res = cursor.fetchall()

        

        res = [[i[0]] for i in res]
        print(res)

        headers = {"Access-Control-Allow-Origin":  "*"}
        data = {
            "data": res 
        }
        cursor.close()

        return JSONResponse(content=data, headers=headers, status_code=200)
    
    except Exception as e:
        headers = {"Access-Control-Allow-Origin":  "*"}

        data = {
            "Error": str(e)
        }
        cursor.close()

        return JSONResponse(content=data, headers=headers, status_code=400)

@data_router.post("/panels/getOne")
async def getOnePanel(payload: Panel, response: Response):
    cursor = mydb.cursor(dictionary=True)

    panel_number = payload.panel_number
  
    sql = f"select time_of_reading from Panels where name='{panel_number}'"

    try:

        cursor.execute(sql)

        res = cursor.fetchall()[0]

        data = {
            "data": res
        }

        headers = {"Access-Control-Allow-Origin":  "*"}
        
        cursor.close()

        return JSONResponse(content=data, headers=headers, status_code=200)
    
    except Exception as e:
        headers = {"Access-Control-Allow-Origin": "*"}

        data = {
            "Error": str(e)
        }
        cursor.close()

        return JSONResponse(content=data, headers=headers, status_code=400)





@data_router.post("/panels/insertOne")
async def updatePanel(payload: PanelPost, response: JSONResponse):

    central_tz = pytz.timezone("US/Central")
    current_date_and_time= datetime.now(central_tz)
    current_time = current_date_and_time.strftime("%H:%M:%S")
    timestamp = ""
    if(current_date_and_time.day < 10):
        timestamp = f"0{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    else:
        timestamp = f"{current_date_and_time.day} {months[current_date_and_time.month - 1]} {current_date_and_time.year} {current_time} CST"
    

    try:

        cursor = mydb.cursor()

        sql = f"update Panels set time_of_reading='{timestamp}',phase_number='{payload.phase_number}',amps='{payload.amps}',AB='{payload.ab}',latest_reading='{payload.latest_reading}',name_notes_detail='{payload.name_notes_detail}',kW_capacity='{payload.kW_capacity}',kW_reading='{payload.kW_reading}',percent_of_breaker='{payload.percent_of_breaker}' where name='{payload.panel_number}'"
        

        cursor.execute(sql)

        mydb.commit()

        

        headers = {"Access-Control-Allow-Origin": "*"}

        data = {
            "Success": "true"
        }

        return JSONResponse(content=data, headers=headers, status_code=200)
    
    except Exception as e:

        headers = {"Access-Control-Allow-Origin": "*"}

        data = {
            "Error": str(e)
        }

        return JSONResponse(content=data, headers=headers, status_code=400)
        




    



@data_router.get("/load")
async def loadInitialData(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    
    cursor = mydb.cursor()

    sql = "select JSON_ARRAYAGG(JSON_OBJECT('timestamp', timestamp, 'value', value)) from Readings"
    cursor.execute(sql)

    results = cursor.fetchall()
    return results


#Helper function that does something im sure
def convert(lister):
    while(len(lister)<16):
        lister.insert(0,0)
    return(lister)

#Helper function that converts bits to floats
def bits_to_float(bits):
    # Convert the list of bits to a binary string
    binary = ''.join(str(bit) for bit in bits)

    # Convert the binary string to an integer
    i = int(binary, 2)

    # Pack the integer into 4 bytes of data using big-endian byte order
    packed = struct.pack('>I', i)

    # Unpack the bytes as a single-precision (32-bit) floating point number
    f = struct.unpack('>f', packed)[0]

    return f

def kw_capacity(phase, amps):
    # Define a dictionary to store multipliers for each condition
    multipliers = {1: 120, 2: 208, 3: 360}
    
    # Check if B5 is one of the keys in the dictionary
    # If yes, calculate the result using the corresponding multiplier
    # If not, default to 0
    result = multipliers.get(phase, 0) * amps
    
    # Divide the result by 1000
    return result / 1000


def kw_reading(phase, live):
    # Define a dictionary to store multipliers for each condition
    multipliers = {1: 120, 2: 208, 3: 360}
    
    # Check if B5 is one of the keys in the dictionary
    # If yes, calculate the result using the corresponding multiplier
    # If not, default to 0
    result2 = multipliers.get(phase,0) * live
    
    # Divide the result by 1000
    return result2 / 1000


        
                
        

# if __name__ == "__main__":
#     main()