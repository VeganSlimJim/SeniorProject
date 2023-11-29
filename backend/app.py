from fastapi import FastAPI
from routers.users import user_router
from routers.auth import auth_router
from routers.data import data_router
from fastapi.middleware.cors import CORSMiddleware
##Create an API 
app = FastAPI()
app.include_router(data_router, prefix="/api/v1/data")
app.include_router(user_router, prefix="/api/v1/users")
app.include_router(auth_router, prefix="/api/v1/auth")

app.add_middleware(
    CORSMiddleware,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"],
    allow_credentials=["*"]
)

#https://github.com/VeganSlimJim/SeniorProject.git
