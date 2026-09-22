from fastapi import FastAPI

app = FastAPI()


@app.post("/api")
def read_root():
    return {"Hello": "World"}