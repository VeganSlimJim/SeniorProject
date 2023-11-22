import bcrypt

def encrypt_password(password: str) -> str:
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_pw.decode('utf-8')

def verify_password(plaintext_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plaintext_password.encode('utf-8'), hashed_password.encode('utf-8'))
