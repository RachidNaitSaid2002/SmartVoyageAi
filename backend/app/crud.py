from sqlalchemy.orm import Session
from .models import User
from .schemas import UserCreate, UserProfileUpdate
from .auth import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_profile(db: Session, user_id: int, profile: UserProfileUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    # Update only provided fields
    update_data = profile.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def track_user_interaction(db: Session, user_id: int, item_impact: dict):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    # Adventure
    if "adventure_score" in item_impact:
        current = db_user.adventure_score or 50
        db_user.adventure_score = int(current * 0.9 + item_impact["adventure_score"] * 0.1)
    
    # Culture
    if "culture_score" in item_impact:
        current = db_user.culture_score or 50
        db_user.culture_score = int(current * 0.9 + item_impact["culture_score"] * 0.1)
        
    # Foodie
    if "foodie_score" in item_impact:
        current = db_user.foodie_score or 50
        db_user.foodie_score = int(current * 0.9 + item_impact["foodie_score"] * 0.1)
        
    # Budget
    if "budget_index" in item_impact:
        current = db_user.budget_index or 0.5
        db_user.budget_index = round(float(current * 0.9 + item_impact["budget_index"] * 0.1), 3)
        
    db.commit()
    db.refresh(db_user)
    return db_user
