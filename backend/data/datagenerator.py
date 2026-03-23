import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import os

# 1. Setup Data Paths
PROJECT_ROOT = "/home/rachid/BigDisk/workspace/Projects/file_rouge"
DATA_DIR = os.path.join(PROJECT_ROOT, "backend/ml/data")
os.makedirs(DATA_DIR, exist_ok=True)

# 2. Define Sample Categorical Values
age_groups = ['18-25', '26-40', '41-60', '60+']
travel_freq = ['Low', 'Medium', 'High']
seasons = ['Winter', 'Spring', 'Summer', 'Autumn']

# 3. Generate 1000 Travelers
np.random.seed(42)
n_users = 1000

data = {
    'user_id': range(1, n_users + 1),
    'Age_Group': np.random.choice(age_groups, n_users),
    'Travel_Frequency': np.random.choice(travel_freq, n_users),
    'Preferred_Season': np.random.choice(seasons, n_users),
    'Budget_Index': np.random.uniform(0.1, 1.0, n_users),  # 0.1=Cheap, 1.0=Luxury
    'Adventure_Score': np.random.randint(0, 100, n_users),
    'Culture_Score': np.random.randint(0, 100, n_users),
    'Foodie_Score': np.random.randint(0, 100, n_users),
    'Family_Focus': np.random.randint(0, 10, n_users)
}

df = pd.DataFrame(data)

# 4. Apply Preprocessing (Label Encoding) as per your workflow
le = LabelEncoder()
df['Age_Encoded'] = le.fit_transform(df['Age_Group'])
df['Freq_Encoded'] = le.fit_transform(df['Travel_Frequency'])
df['Season_Encoded'] = le.fit_transform(df['Preferred_Season'])

# 5. Drop Raw Strings to make it "Model-Ready"
cols_to_keep = [
    'user_id', 'Age_Encoded', 'Freq_Encoded', 'Season_Encoded', 
    'Budget_Index', 'Adventure_Score', 'Culture_Score', 
    'Foodie_Score', 'Family_Focus'
]
df_clean = df[cols_to_keep]

# 6. Save the Preprocessed Data
df_clean.to_csv(os.path.join(DATA_DIR, "Preprocessed_Users.csv"), index=False)
print(f"Successfully generated 1000 rows in: {DATA_DIR}/Preprocessed_Users.csv")
