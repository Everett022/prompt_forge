from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from dotenv import load_dotenv
from app.database import engine, Base
from app.routers import prompts, workflows
import os

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PromptForge API",
    description="Visual prompt building engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prompts.router)
app.include_router(workflows.router)

@app.get("/")
def root():
    return {"status": "PromptForge API running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}