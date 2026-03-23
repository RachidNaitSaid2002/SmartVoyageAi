from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserProfileUpdate(BaseModel):
    age_encoded: Optional[int] = None
    freq_encoded: Optional[int] = None
    season_encoded: Optional[int] = None
    budget_index: Optional[float] = None
    adventure_score: Optional[int] = None
    culture_score: Optional[int] = None
    foodie_score: Optional[int] = None
    family_focus: Optional[int] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    # Only return profile if it exists
    age_encoded: Optional[int] = None
    budget_index: Optional[float] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserInteraction(BaseModel):
    category: str # e.g., 'hiking', 'riad', 'museum'
    item_id: Optional[str] = None
