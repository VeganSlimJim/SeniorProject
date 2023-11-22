from pydantic import BaseModel

class JWTTOKEN(BaseModel):
    token: str