import os
import joblib
import pandas as pd
import numpy as np

# Path Setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "models", "user_segmentation_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ml", "models", "scaler.pkl")

PERSONAS = ["Relaxed Explorer", "Thrill Seeker", "Luxury Nomad", "Cultural Connoisseur"]

def test_load_models():
    """Verify that ML models exist and can be loaded."""
    assert os.path.exists(MODEL_PATH), f"Model file not found at {MODEL_PATH}"
    assert os.path.exists(SCALER_PATH), f"Scaler file not found at {SCALER_PATH}"
    
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    
    assert model is not None, "Model failed to load"
    assert scaler is not None, "Scaler failed to load"

def test_persona_prediction():
    """Test that a mock DNA profile produces a valid persona."""
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    
    # Mock traveler DNA (Budget, Adventure, Culture, Foodie, Family)
    # 0.5 budget, 80 adventure, 20 culture, 40 foodie, 5 family
    mock_dna = [[0.5, 80, 20, 40, 5]]
    columns = ['Budget_Index', 'Adventure_Score', 'Culture_Score', 'Foodie_Score', 'Family_Focus']
    
    input_df = pd.DataFrame(mock_dna, columns=columns)
    scaled_data = scaler.transform(input_df)
    cluster_id = int(model.predict(scaled_data)[0])
    
    persona_name = PERSONAS[cluster_id]
    
    print(f"\n[TEST] Input DNA: {mock_dna} -> Predicted: {persona_name}")
    assert persona_name in PERSONAS, f"Predicted persona '{persona_name}' not in list"
    assert 0 <= cluster_id < len(PERSONAS), "Cluster ID out of range"

if __name__ == "__main__":
    # Manual run for verification if needed
    try:
        test_load_models()
        test_persona_prediction()
        print("\nAll prediction tests passed successfully.")
    except Exception as e:
        print(f"\nTest failed: {e}")
