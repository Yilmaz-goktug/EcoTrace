# EcoTrace

Bir karbon ayak izi hesaplama uygulaması. Backend Flask + PostgreSQL, frontend React + Tailwind CSS, veri görselleştirme Chart.js.

## Klasör Yapısı

- `backend/`: Backend uygulaması
- `frontend/`: React frontend uygulaması

## Başlatma

### Backend
```powershell
python -m venv backend/venv
.\backend\venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
cd backend
python app/main.py
```

### Frontend
```powershell
cd frontend
npm install
npm run dev
```
