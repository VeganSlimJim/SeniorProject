from pymodbus.client import ModbusTcpClient as client
import struct
from datetime import datetime

def convert(lister):
    while(len(lister)<16):
        lister.insert(0,0)
    return(lister)


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

#f = bits_to_float(bit_32)
#print(f)

p = bits_to_float(bit_32_RTL)
print(p)
#Format the data and time as a string
#Year-Month_Hour_Minute_Second
timestamp = now.strftime("%Y-%m-%d_%H-%M-%S")
#Write the floating point number to a file with the timestamp in the filename
with open(f'output_{timestamp}.txt','w') as f:
    f.write(str(p))

PLC.close()
