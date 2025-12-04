from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.models import (
    Opportunity,
    OpportunityCreate,
    OpportunityUpdate,
    OpportunityStage,
    OpportunityStats,
)
from app.database import db

load_dotenv()

app = FastAPI(
    title="Anderson CRM - Business Opportunity API",
    description="API for managing business opportunities in Anderson CRM",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://business-opportunity-app-tjez93e1.devinapps.com",
    "https://business-opportunity-app-tunnel-teb0f1pc.devinapps.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.devinapps\.com",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Anderson CRM - Business Opportunity Management API", "version": "1.0.0"}


@app.get("/api/opportunities", response_model=list[Opportunity])
async def list_opportunities(
    stage: Optional[OpportunityStage] = Query(None, description="Filter by opportunity stage"),
    search: Optional[str] = Query(None, description="Search by name, company, or contact person"),
):
    return db.get_all(stage=stage, search=search)


@app.get("/api/opportunities/stats", response_model=OpportunityStats)
async def get_opportunity_stats():
    return db.get_stats()


@app.get("/api/opportunities/{opportunity_id}", response_model=Opportunity)
async def get_opportunity(opportunity_id: int):
    opportunity = db.get(opportunity_id)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity


@app.post("/api/opportunities", response_model=Opportunity, status_code=201)
async def create_opportunity(opportunity: OpportunityCreate):
    return db.create(opportunity)


@app.put("/api/opportunities/{opportunity_id}", response_model=Opportunity)
async def update_opportunity(opportunity_id: int, opportunity: OpportunityUpdate):
    updated = db.update(opportunity_id, opportunity)
    if not updated:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return updated


@app.delete("/api/opportunities/{opportunity_id}", status_code=204)
async def delete_opportunity(opportunity_id: int):
    if not db.delete(opportunity_id):
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return None
