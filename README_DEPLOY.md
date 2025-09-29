# Deploying Seamless Gov Dashboard (FastAPI)

## Prerequisites
- GitHub repository with these files:
  - `fastapi_app.py`
  - `requirements.txt`
  - `Procfile`
  - (optional) `.gitignore`

## Run locally
```
pip install -r requirements.txt
uvicorn fastapi_app:app --host 0.0.0.0 --port 8000
```
- Public endpoint: `http://localhost:8000/bill`
- Protected endpoints use API key (header `x-api-key` or query `?api_key=`)

## Deploy on Railway
1. Push to GitHub
2. Railway → New Project → Deploy from GitHub → select repo
3. Set Variables:
   - `API_KEY` = your-secret-key
4. Railway will use Procfile automatically. If prompted, use:
```
uvicorn fastapi_app:app --host 0.0.0.0 --port $PORT
```
5. After deploy, use:
- Public: `https://<your-subdomain>.up.railway.app/bill`
- Protected: `https://<your-subdomain>.up.railway.app/api/amendment/1?api_key=YOUR_KEY`
