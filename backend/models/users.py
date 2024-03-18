from pydantic import BaseModel, Field
from typing import Optional

class User(BaseModel):
    user_id: Optional[str] = Field(None, alias="user_id")
    password: str
    email: str
    first_name: str
    last_name: str
    user_role: str
    creation_date: Optional[str] = Field(None, alias="creation_date")

class DeletedUser(BaseModel):
    email: str

class UpdatedUser(BaseModel):
    token: str
    email: str
    password: str
    first_name: str
    last_name: str
    user_role: str
    creation_date: Optional[str] = Field(None, alias="creation_date")