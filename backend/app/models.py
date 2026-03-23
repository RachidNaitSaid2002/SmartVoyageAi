from sqlalchemy import Boolean, Column, Integer, String, Float
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # Re-using the features we saw in Preprocessed_Users.csv
    age_encoded = Column(Integer, nullable=True)
    freq_encoded = Column(Integer, nullable=True)
    season_encoded = Column(Integer, nullable=True)
    budget_index = Column(Float, nullable=True)
    adventure_score = Column(Integer, nullable=True)
    culture_score = Column(Integer, nullable=True)
    foodie_score = Column(Integer, nullable=True)
    family_focus = Column(Integer, nullable=True)
