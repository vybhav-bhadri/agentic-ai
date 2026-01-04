from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Any
import json

Platform = Literal["twitter", "instagram", "linkedin", "email"]

Tone = Literal["casual", "professional", "busy"]
InteractionStage = Literal[
    "first_contact", "follow_up_1", "follow_up_2", "warm_nudge",
    "post_meeting_thanks", "ask_for_intro", "close_breakup",
    "social_reply", "social_comment"
]

class OutreachRequest(BaseModel):
    platform: Literal["twitter", "instagram", "linkedin"]
    interaction_stage: Literal[
        "first_contact", "follow_up_1", "follow_up_2", "warm_nudge",
        "post_meeting_thanks", "ask_for_intro", "close_breakup",
        "social_reply", "social_comment"
    ]
    tone: Literal["casual", "professional", "busy"]
    person_name: Optional[str] = None
    why: Optional[str] = None
    context: Optional[str] = None

class NextStep(BaseModel):
    condition: Literal["positive", "neutral", "negative"]
    instruction: str

class OutreachResponse(BaseModel):
    platform: Platform
    interaction_stage: InteractionStage
    tone: Tone
    person_name: Optional[str] = None
    why: Optional[str] = None
    subject: Optional[str] = None
    message: str
    context: Optional[str] = None
    length_chars: int
    personalization_clues: List[str] = []
    next_steps: List[NextStep] = []
    safety_checks_passed: bool = True
    reasons_for_denial: Optional[List[str]] = None

class UserInput(BaseModel):
    """Simplified user input model for API requests"""
    platform: Literal["twitter", "instagram", "linkedin"]
    interaction_stage: Literal[
        "first_contact", "follow_up_1", "follow_up_2", "warm_nudge",
        "post_meeting_thanks", "ask_for_intro", "close_breakup",
        "social_reply", "social_comment"
    ]
    tone: Literal["casual", "professional", "busy"]
    char_limit: Optional[int] = None
    input: str  # The user's requirement/context

def parse_query_string(query_str: str) -> dict:
    try:
        return json.loads(query_str)
    except Exception as e:
        raise ValueError(f"Invalid query JSON string: {e}")