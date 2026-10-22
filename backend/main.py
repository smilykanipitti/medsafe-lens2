from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import fitz
import json

app = FastAPI(title="MedSafe Lens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "MedSafe Lens Backend is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/upload-prescription")
async def upload_prescription(uploaded_file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)

    with open(file_path, "wb") as buffer:
        content = await uploaded_file.read()
        buffer.write(content)

    # Extract text from PDF
    extracted_text = ""

    if uploaded_file.filename.lower().endswith(".pdf"):
        pdf = fitz.open(file_path)

        for page in pdf:
            extracted_text += page.get_text()

        pdf.close()

    # Medicine detection
    medicine_list = []

    known_medicines = [
        "Amoxicillin",
        "Warfarin",
        "Paracetamol"
    ]

    for medicine in known_medicines:
        if medicine.lower() in extracted_text.lower():
            medicine_list.append(medicine)

    # Duplicate detection
    duplicate_medicines = []

    medicine_lower = [medicine.lower() for medicine in medicine_list]

    for medicine in set(medicine_lower):
        if medicine_lower.count(medicine) > 1:
            duplicate_medicines.append(medicine)

    # Load interaction data
    interaction_file = "interactions.json"

    with open(interaction_file, "r") as interaction_data:
        interactions = json.load(interaction_data)

    # Interaction checking
    detected_interactions = []

    for interaction in interactions:

        drug1 = interaction["drug1"]
        drug2 = interaction["drug2"]

        if drug1 in medicine_list and drug2 in medicine_list:
            detected_interactions.append(interaction)

    return {
        "message": "Prescription analyzed successfully",
        "filename": uploaded_file.filename,
        "extracted_text": extracted_text,
        "medicines": medicine_list,
        "duplicate_medicines": duplicate_medicines,
        "interactions": detected_interactions
    }