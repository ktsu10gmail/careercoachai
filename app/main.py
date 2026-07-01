from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.api.api import api_router
from app.db import models  # noqa: F401
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Career Coaching AI",
    description="Automatic recruitment platform with AI-assisted scoring, applicant ranking, and Swagger/OpenAPI documentation.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return RedirectResponse(url="/ui")
