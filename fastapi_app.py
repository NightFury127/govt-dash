from fastapi import FastAPI, Depends, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import aiosqlite
import os

API_KEY = os.getenv("API_KEY", "sk-2b8e1e7c-4f7a-4e2a-9c1e-8d2e7b1a6f3c")
DB_PATH = os.getenv("DB_PATH", "amendments.db")

app = FastAPI(title="Seamless Gov Dashboard API (FastAPI)")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"]
)

# Serve static files (index.html, app.js, style.css) from project root
app.mount("/static", StaticFiles(directory="."), name="static")

async def require_api_key(request: Request, x_api_key: str | None = Header(default=None)):
	key = x_api_key or request.query_params.get("api_key") or request.query_params.get("key")
	if key != API_KEY:
		raise HTTPException(status_code=401, detail="Unauthorized: Invalid API key")

class SendAmendmentPayload(BaseModel):
	amendmentName: str

@app.on_event("startup")
async def startup():
	async with aiosqlite.connect(DB_PATH) as db:
		await db.execute(
			"""
			CREATE TABLE IF NOT EXISTS friend_amendments (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				amendment_name TEXT NOT NULL,
				sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
			"""
		)
		await db.commit()

# Public, browser-friendly endpoint similar to Railway example
# Returns the latest amendment name
@app.get("/bill")
async def get_latest_bill():
	async with aiosqlite.connect(DB_PATH) as db:
		async with db.execute(
			"SELECT amendment_name FROM friend_amendments ORDER BY id DESC LIMIT 1"
		) as cursor:
			row = await cursor.fetchone()
			name = row[0] if row else "Digital Privacy Protection Act 2025"
			return {"bill": name}

# Serve index.html at root if present
@app.get("/")
async def root_index():
	if os.path.exists("index.html"):
		return FileResponse("index.html")
	return {"status": "ok"}

@app.post("/api/send-amendment")
async def send_amendment(payload: SendAmendmentPayload, _: None = Depends(require_api_key)):
	if not payload.amendmentName:
		raise HTTPException(status_code=400, detail="Amendment name is required.")
	async with aiosqlite.connect(DB_PATH) as db:
		await db.execute(
			"INSERT INTO friend_amendments (amendment_name) VALUES (?)",
			(payload.amendmentName,)
		)
		await db.commit()
	return {"message": f"Amendment '{payload.amendmentName}' saved to your friend's database!"}

@app.get("/api/amendment/{amendment_id}")
async def get_amendment(amendment_id: int, _: None = Depends(require_api_key)):
	async with aiosqlite.connect(DB_PATH) as db:
		async with db.execute(
			"SELECT amendment_name FROM friend_amendments WHERE id = ?",
			(amendment_id,)
		) as cursor:
			row = await cursor.fetchone()
			if not row:
				raise HTTPException(status_code=404, detail="Amendment not found.")
			return {"amendmentName": row["amendment_name"]}
