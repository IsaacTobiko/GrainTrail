from fastapi import FastAPI  
from fastapi.middleware.cors import CORSMiddleware  
from app.routers import auth, deals, loads

app = FastAPI(title="GrainTrail API")  

app.add_middleware(  
    CORSMiddleware, 
    allow_origins=["http://localhost:3000"],  
    allow_methods=["*"],  
    allow_headers=["*"],  
)
app.include_router(auth.router)  
app.include_router(deals.router)
app.include_router(loads.router)

@app.get("/health")  
def health():  
    return {"status": "ok"}  