from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.models import PromptHistory
from app.services.prompt_builder import build_prompt, get_tree
from app.services.ai_service import enhance_prompt, generate_followup_questions

router = APIRouter(prefix="/api/prompts", tags=["prompts"])

class PromptState(BaseModel):
    category: Optional[str] = None
    format: Optional[str] = None
    tone: Optional[str] = None
    audience: Optional[str] = None
    answers: Optional[dict] = {}

class EnhanceRequest(BaseModel):
    prompt_text: str
    state: Optional[dict] = {}

@router.get("/tree")
def get_prompt_tree():
    return get_tree()

@router.post("/build")
def build_prompt_endpoint(state: PromptState, db: Session = Depends(get_db)):
    prompt = build_prompt(state.dict())
    history = PromptHistory(
        prompt_text=prompt,
        tree_state=state.dict(),
        category=state.category
    )
    db.add(history)
    db.commit()
    return {"prompt": prompt, "state": state.dict()}

@router.post("/enhance")
def enhance_prompt_endpoint(req: EnhanceRequest):
    try:
        enhanced = enhance_prompt(req.prompt_text)
        return {"enhanced_prompt": enhanced, "original_prompt": req.prompt_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/followup")
def get_followup(state: PromptState):
    try:
        questions = generate_followup_questions(state.dict())
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def get_history(db: Session = Depends(get_db), limit: int = 20):
    history = db.query(PromptHistory).order_by(
        PromptHistory.created_at.desc()
    ).limit(limit).all()
    return history