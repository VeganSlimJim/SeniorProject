from fastapi import FastAPI, Response
import mysql.connector
import random
from datetime import datetime
import pytz
from pymodbus.client import ModbusTcpClient as client
import struct

##Create an API 
app = FastAPI()

##defines the mysql connection
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

##test version of the /testapi/data/new
@app.get("/testapi/data/new")
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



#GET route for retrieving a reading from the PLC
@app.get("/api/data/new")
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
