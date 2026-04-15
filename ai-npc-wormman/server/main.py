"""Worm Man NPC Server — FastAPI backend orchestrating brain, voice, and ears."""

import asyncio
import json
import time
import os
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import npc_brain
import npc_voice
import npc_ears

ROOT = Path(__file__).parent.parent
OUTPUT_DIR = ROOT / "output"
FRONTEND_DIR = ROOT / "frontend"
ASSETS_DIR = ROOT / "assets"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Worm Man NPC")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.mount("/output", StaticFiles(directory=str(OUTPUT_DIR)), name="output")
app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")


# ─── Routes ─────────────────────────────────────────

@app.get("/")
async def index():
    return FileResponse(str(FRONTEND_DIR / "index.html"))


@app.get("/style.css")
async def style():
    return FileResponse(str(FRONTEND_DIR / "style.css"), media_type="text/css")


@app.get("/app.js")
async def script():
    return FileResponse(str(FRONTEND_DIR / "app.js"), media_type="application/javascript")


@app.get("/audio-sync.js")
async def audio_sync_js():
    return FileResponse(str(FRONTEND_DIR / "audio-sync.js"), media_type="application/javascript")


@app.get("/character-renderer.js")
async def character_renderer_js():
    return FileResponse(str(FRONTEND_DIR / "character-renderer.js"), media_type="application/javascript")


@app.post("/api/chat")
async def chat_text(body: dict):
    """Text-only chat. Returns Worm Man's text reply + audio URL."""
    user_msg = body.get("message", "").strip()
    if not user_msg:
        return JSONResponse({"error": "Empty message"}, status_code=400)

    result = await _full_pipeline(user_msg)
    return result


@app.post("/api/reset")
async def reset():
    """Wipe Worm Man's memory."""
    npc_brain.reset_memory()
    return {"status": "Memory wiped. Worm Man has forgotten everything. Again."}


@app.get("/api/model")
async def get_model():
    return {"model": npc_brain.get_model(), "size": npc_brain.get_model_size(), "available": list(npc_brain.MODELS.keys())}


@app.post("/api/model")
async def set_model(body: dict):
    size = body.get("size", "")
    actual = npc_brain.set_model_size(size)
    return {"model": npc_brain.get_model(), "size": actual}


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    """WebSocket for real-time chat. Text or audio in, audio URL + text out."""
    await ws.accept()

    try:
        while True:
            data = await ws.receive()

            if "text" in data:
                msg = json.loads(data["text"])

                if msg.get("type") == "text":
                    await ws.send_json({"type": "status", "status": "thinking"})
                    result = await _full_pipeline(msg["message"])
                    await ws.send_json({"type": "response", **result})

                elif msg.get("type") == "reset":
                    npc_brain.reset_memory()
                    await ws.send_json({"type": "status", "status": "Memory wiped."})

            elif "bytes" in data:
                audio_bytes = data["bytes"]
                await ws.send_json({"type": "status", "status": "listening"})

                try:
                    transcript = await npc_ears.transcribe_bytes(audio_bytes, sample_rate=16000)
                except Exception as e:
                    await ws.send_json({"type": "status", "status": f"Voice input failed: {e}"})
                    continue

                if not transcript:
                    await ws.send_json({"type": "status", "status": "Couldn't hear you. Worm Man's ears are... well, he doesn't have ears."})
                    continue

                await ws.send_json({"type": "transcript", "text": transcript})
                await ws.send_json({"type": "status", "status": "thinking"})

                result = await _full_pipeline(transcript)
                await ws.send_json({"type": "response", **result})

    except WebSocketDisconnect:
        pass


# ─── Pipeline ───────────────────────────────────────

async def _full_pipeline(user_message: str) -> dict:
    """Brain -> Voice -> return audio URL. Frontend handles animation via canvas."""
    t0 = time.time()

    reply_text = await npc_brain.chat(user_message)
    t_brain = time.time() - t0

    try:
        audio_path = await npc_voice.synthesize(reply_text)
        t_voice = time.time() - t0 - t_brain
    except Exception as e:
        print(f"[Voice] TTS failed: {e}")
        return {
            "text": reply_text,
            "media_url": None,
            "timing": {"brain": round(t_brain, 2), "voice": 0, "total": round(t_brain, 2)},
        }

    media_url = f"/output/{audio_path.name}"
    total = time.time() - t0

    return {
        "text": reply_text,
        "media_url": media_url,
        "timing": {
            "brain": round(t_brain, 2),
            "voice": round(t_voice, 2),
            "total": round(total, 2),
        },
    }


# ─── Cleanup old output files on startup ────────────

@app.on_event("startup")
async def cleanup_old_output():
    """Remove output files older than 1 hour."""
    cutoff = time.time() - 3600
    for f in OUTPUT_DIR.iterdir():
        if f.is_file() and f.stat().st_mtime < cutoff:
            f.unlink(missing_ok=True)


# ─── Entry point ────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8425"))
    print(f"\n  WORM MAN NPC SERVER")
    print(f"  http://localhost:{port}")
    print(f"  \"You just got WORMED.\"\n")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
