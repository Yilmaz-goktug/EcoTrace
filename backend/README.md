# EcoTrace Backend

Flask backend uygulaması. SQLAlchemy ile PostgreSQL bağlantısı, Flask-Migrate ile veri tabanı yönetimi.

## Başlatma

```powershell
python -m venv backend/venv
.\backend\venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
set FLASK_APP=app/main.py
set FLASK_ENV=development
flask run
```

`src/app/main.py` uygulama giriş noktasını içerir.
