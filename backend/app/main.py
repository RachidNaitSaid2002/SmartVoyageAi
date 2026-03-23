from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from jose import JWTError, jwt
import json
import os
import joblib
import numpy as np
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate

from .database import get_db, Base, engine
from .models import User
from .schemas import UserCreate, UserOut, Token, UserLogin, UserProfileUpdate, UserInteraction
from .crud import create_user, get_user_by_email, get_user_by_id, update_user_profile, track_user_interaction
from .auth import verify_password, create_access_token, SECRET_KEY, ALGORITHM

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartVoyageAi API")

# Path to ML Models
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "models", "user_segmentation_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "models", "scaler.pkl")

# Load model and scaler lazily
try:
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        print("ML Model and Scaler loaded successfully.")
    else:
        model, scaler = None, None
except Exception as e:
    print(f"Error loading ML models: {e}")
    model, scaler = None, None

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

@app.get("/")
def read_root():
    return {"message": "Welcome to SmartVoyageAi API"}

# AUTH ENDPOINTS
@app.post("/api/auth/signup", response_model=UserOut)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)

@app.post("/api/auth/signin", response_model=Token)
def signin(user_login: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=user_login.email)
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# USER ENDPOINTS
@app.get("/api/users/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.patch("/api/users/profile", response_model=UserOut)
def update_profile(profile: UserProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_user = update_user_profile(db=db, user_id=current_user.id, profile=profile)
    return updated_user

@app.post("/api/track/interaction")
def track_interaction(interaction: UserInteraction, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    impact_map = {
        "hiking": {"adventure_score": 100, "culture_score": 10},
        "riad": {"budget_index": 0.8, "culture_score": 90},
        "street_food": {"foodie_score": 100, "budget_index": 0.1},
        "museum": {"culture_score": 100, "adventure_score": 0}
    }
    impact = impact_map.get(interaction.category.lower(), {"adventure_score": 50})
    updated_user = track_user_interaction(db, current_user.id, impact)
    return {"message": "AI Tracking Active"}

@app.get("/api/recommendations")
def get_recommendations(current_user: User = Depends(get_current_user)):
    input_data = [current_user.budget_index or 0.5, current_user.adventure_score or 50, current_user.culture_score or 50, current_user.foodie_score or 50, current_user.family_focus or 5]
    persona_name = "Explorer"
    if model and scaler:
        input_df = pd.DataFrame([input_data], columns=['Budget_Index', 'Adventure_Score', 'Culture_Score', 'Foodie_Score', 'Family_Focus'])
        scaled_data = scaler.transform(input_df)
        cluster_id = int(model.predict(scaled_data)[0])
        persona_name = ["Relaxed Explorer", "Thrill Seeker", "Luxury Nomad", "Cultural Connoisseur"][cluster_id]
    
    keywords = {
        1: ['safari', 'hike', 'quad', 'trek'],
        3: ['museum', 'history', 'souk', 'medina'],
        2: ['private', 'luxury', 'resort'],
        0: ['beach', 'park', 'garden']
    }
    target_words = keywords.get(cluster_id if 'cluster_id' in locals() else 0, keywords[0])
    activites_path = os.path.join(os.path.dirname(__file__), "..", "data", "Activites.json")
    try:
        with open(activites_path, 'r', encoding='utf-8') as f:
            all_activities = json.load(f)
        recommendations = [item for item in all_activities if any(word in str(item.get('title','')).lower() for word in target_words)][:8]
        return {"persona": persona_name, "recommendations": recommendations}
    except: return {"error": "Load error"}

# --- LANGCHAIN RAG SETUP ---
CHROMA_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "chroma_db")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

try:
    if os.path.exists(CHROMA_PATH):
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vector_db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)
        print("LangChain Vector Store loaded.")
    else:
        vector_db = None
except Exception as e:
    print(f"Vector Store Error: {e}")
    vector_db = None

@app.post("/api/ai/chat")
def ai_chat(message: str, current_user: User = Depends(get_current_user)):
    if not vector_db: raise HTTPException(status_code=503, detail="AI Vector Store not ready.")
    if not GOOGLE_API_KEY: raise HTTPException(status_code=500, detail="Missing GOOGLE_API_KEY in .env")

    # Persona Prediction
    input_data = [current_user.budget_index or 0.5, current_user.adventure_score or 50, current_user.culture_score or 50, current_user.foodie_score or 50, current_user.family_focus or 5]
    persona_name = "Explorer"
    if model and scaler:
        input_df = pd.DataFrame([input_data], columns=['Budget_Index', 'Adventure_Score', 'Culture_Score', 'Foodie_Score', 'Family_Focus'])
        scaled_data = scaler.transform(input_df)
        cluster_id = int(model.predict(scaled_data)[0])
        persona_name = ["Relaxed Explorer", "Thrill Seeker", "Luxury Nomad", "Cultural Connoisseur"][cluster_id]

    # Manual RAG Flow with Enhanced Prompt Engineering
    docs = vector_db.similarity_search(message, k=4)
    context = "\n".join([f"Node {i+1}: {d.page_content}" for i, d in enumerate(docs)])
    
    # Using stable version
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GOOGLE_API_KEY)
    
    template = """
    #### SMARTVOYAGE SCOUT BIOMETRIC LOG ####
    SYSTEM: Gemini 1.5 | Persona: {persona}
    CORE_CONTEXT: {context}
    
    INSTRUCTIONS:
    You are the SmartVoyage Scout, a high-end AI Travel Expert from Morocco. 
    Use the provided context to answer the traveler's question: "{question}".
    
    OUTPUT FORMAT (Use Markdown):
    1. **Curated Pick**: Identify the best match from the context.
    2. **Why it fits your DNA**: Explain based on their {persona} persona.
    3. **Scout's Insider Tip**: Provide a local, creative piece of advice (e.g., best time to visit, secret dish).
    
    Keep the tone premium, enthusiastic, and organize with bullet points. 
    IF THE CONTEXT IS EMPTY, apologize and offer to search for something else in Agadir.
    
    SCOUT_RESPONSE:
    """
    
    prompt = template.format(context=context, question=message, persona=persona_name)
    response = llm.invoke(prompt)
    
    return {"reply": response.content, "persona_used": persona_name, "sources_count": len(docs)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
