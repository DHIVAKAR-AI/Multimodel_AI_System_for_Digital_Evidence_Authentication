# VERIDEX Multimodal Forensics

VERIDEX is an AI-powered forensic evidence analysis platform supporting multimodal analysis (images, documents, video, audio) with Gemini Vision OCR.

## Gemini API Configuration for OCR

To use Google Gemini for OCR:

1. Open the [backend/.env](file:///a:/veridex-project/backend/.env) file.
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google Gemini API key:
   ```env
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. Get a free or paid Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Starting the Application

### 1. Backend (FastAPI)
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
API status and health check: `http://localhost:8000/api/config-status`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.
