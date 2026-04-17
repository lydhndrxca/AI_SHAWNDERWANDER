"""
SHAWNDERMIXER — Stem Separation Server
FastAPI backend wrapping Meta's Demucs (HTDemucs v4) for GPU-accelerated stem splitting.
"""

import os
import sys
import json
import shutil
import tempfile
import asyncio
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="SHAWNDERMIXER Stem Server")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STEMS_DIR = Path(tempfile.gettempdir()) / "shawndermixer_stems"
STEMS_DIR.mkdir(exist_ok=True)

_separator = None
_model_loaded = False


def _get_separator():
    """Lazy-load the Demucs separator on first request."""
    global _separator, _model_loaded
    if _model_loaded:
        return _separator
    try:
        import demucs.api
        print("[Stems] Loading HTDemucs model (first run downloads ~80MB)...")
        _separator = demucs.api.Separator(
            model="htdemucs",
            segment=40,
            overlap=0.25,
            shifts=1,
            split=True,
        )
        _model_loaded = True
        device = "CUDA" if next(_separator.model.parameters()).is_cuda else "CPU"
        print(f"[Stems] Model loaded on {device}")
        return _separator
    except Exception as e:
        print(f"[Stems] Failed to load Demucs: {e}")
        _model_loaded = True
        _separator = None
        return None


@app.get("/api/stems/status")
async def stem_status():
    """Check if the stem separation backend is available."""
    try:
        import demucs
        return {"available": True, "model": "htdemucs"}
    except ImportError:
        return {"available": False, "error": "demucs not installed"}


@app.post("/api/stems/separate")
async def separate_stems(file: UploadFile = File(...)):
    """
    Accept an audio file, run Demucs stem separation, return paths to the 4 stems.
    Stems: vocals, drums, bass, other
    """
    sep = _get_separator()
    if sep is None:
        raise HTTPException(500, "Demucs model not available. Check server logs.")

    job_dir = STEMS_DIR / f"job_{os.getpid()}_{id(file)}"
    job_dir.mkdir(exist_ok=True)

    input_path = job_dir / file.filename
    try:
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)

        print(f"[Stems] Separating: {file.filename} ({len(content) / 1024 / 1024:.1f} MB)")

        origin, separated = await asyncio.to_thread(
            sep.separate_audio_file, str(input_path)
        )

        import demucs.api as dapi
        import soundfile as sf

        stem_names = list(separated.keys())
        result = {"stems": [], "original": file.filename}

        for stem_name in stem_names:
            tensor = separated[stem_name]
            out_path = job_dir / f"{stem_name}.wav"
            dapi.save_audio(tensor, str(out_path), samplerate=44100)
            result["stems"].append({
                "name": stem_name,
                "url": f"/api/stems/file/{job_dir.name}/{stem_name}.wav",
            })

        print(f"[Stems] Done — {len(stem_names)} stems: {', '.join(stem_names)}")
        return JSONResponse(result)

    except Exception as e:
        print(f"[Stems] Error: {e}")
        raise HTTPException(500, str(e))
    finally:
        if input_path.exists():
            input_path.unlink()


@app.get("/api/stems/file/{job_id}/{filename}")
async def get_stem_file(job_id: str, filename: str):
    """Serve a separated stem WAV file."""
    path = STEMS_DIR / job_id / filename
    if not path.exists():
        raise HTTPException(404, "Stem file not found")
    return FileResponse(path, media_type="audio/wav", filename=filename)


# Serve the frontend from the parent directory
FRONTEND_DIR = Path(__file__).parent.parent
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    print("=" * 48)
    print("  SHAWNDERMIXER — Stem Separation Server")
    print("=" * 48)
    print()
    uvicorn.run(app, host="0.0.0.0", port=8095)
