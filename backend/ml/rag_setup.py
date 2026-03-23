import json
import os
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document

# Path Setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
CHROMA_PATH = os.path.join(BASE_DIR, "ml", "chroma_db")

def create_vector_store():
    # 1. Initialize local embeddings
    print("Initializing embeddings (HuggingFace)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    docs = []
    
    # 2. Process Activities
    activites_file = os.path.join(DATA_DIR, "Activites.json")
    if os.path.exists(activites_file):
        print(f"Processing {activites_file}...")
        with open(activites_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                content = f"Activity: {item.get('title')}. Category: {item.get('category')}. Price: {item.get('price')} MAD. Description: {item.get('details', {}).get('description', '')}"
                docs.append(Document(page_content=content, metadata={"id": item.get('id'), "type": "activity"}))

    # 3. Process Restaurants
    rest_file = os.path.join(DATA_DIR, "restaurantDetails.json")
    if os.path.exists(rest_file):
        print(f"Processing {rest_file}...")
        with open(rest_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                content = f"Restaurant: {item.get('name')}. Location: {item.get('locationString')}. Rating: {item.get('rating')}. Address: {item.get('address')}"
                docs.append(Document(page_content=content, metadata={"id": item.get('id'), "type": "restaurant"}))

    if not docs:
        print("No documents found to index.")
        return

    # 4. Create and persist the Vector Store
    print(f"Indexing {len(docs)} documents into ChromaDB at {CHROMA_PATH}...")
    db = Chroma.from_documents(
        docs, 
        embeddings, 
        persist_directory=CHROMA_PATH
    )
    
    print("Vector Store created successfully.")

if __name__ == "__main__":
    create_vector_store()
