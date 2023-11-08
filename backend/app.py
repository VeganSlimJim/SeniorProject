from fastapi import FastAPI, Response

app = FastAPI()

@app.get("/api/data/new")
async def getData(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return {"message": "receieved"}



