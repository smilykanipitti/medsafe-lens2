# 💊 MedSafe Lens

### Prescription Conflict and Medication Safety Assistant

MedSafe Lens is a web-based project designed to extract medicine names from uploaded prescriptions and demonstrate how potential medication conflicts can be identified.

## 🚀 Features

* Upload prescription PDF files.
* Extract prescription text using PyMuPDF.
* Identify selected medicine names.
* Demonstrate potential medication interaction checks.
* React-based user interface.
* FastAPI backend.

## 🛠️ Technologies Used

* **Frontend:** React, Vite
* **Backend:** Python, FastAPI
* **PDF Processing:** PyMuPDF
* **Data Storage:** JSON-based demo interaction data

## 📁 Project Structure

* `backend/` — FastAPI application and prescription processing.
* `medsafe-lens/` — React frontend application.

## ▶️ How to Run

### 1. Start the Backend

Open PowerShell:

```powershell
cd "C:\Users\SmilyRaj\OneDrive\Desktop\med\backend"
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

Backend API documentation:
http://127.0.0.1:8000/docs

### 2. Start the Frontend

Open a second PowerShell window:

```powershell
cd "C:\Users\SmilyRaj\OneDrive\Desktop\med\medsafe-lens"
npm run dev
```

Open the local URL displayed in the terminal, usually:
http://localhost:5173/

## ⚠️ Important Medical Disclaimer

This project is an educational prototype. Its medicine detection and interaction data are limited and are not clinically validated. It must not be used to make medical decisions or replace advice from a qualified healthcare professional.

## 🔮 Future Improvements

* Improve medicine recognition using OCR.
* Integrate reliable, appropriately licensed medication reference data.
* Add medicine normalization and duplicate detection.
* Improve validation, testing, and error handling.

## 👩‍💻 Project Status

Educational prototype under development.
