"""Worm Man's ears — Whisper-based speech-to-text from microphone audio."""

import asyncio
import os
import sys
import tempfile
from pathlib import Path

# ─── Fix NVIDIA DLL discovery on Windows ───
# pip puts DLLs in site-packages/nvidia/*/bin/ (not lib/)
# Windows Python 3.8+ needs os.add_dll_directory(), PATH alone won't work
def _register_nvidia_dlls():
    if sys.platform != "win32":
        return
    try:
        import site
        for sp in site.getsitepackages():
            nvidia_root = Path(sp) / "nvidia"
            if not nvidia_root.exists():
                continue
            for bin_dir in nvidia_root.rglob("bin"):
                if bin_dir.is_dir():
                    os.add_dll_directory(str(bin_dir))
    except Exception:
        pass

_register_nvidia_dlls()

_whisper_model = None
_use_cpu = False
WHISPER_MODEL_SIZE = "small"
OUTPUT_DIR = Path(__file__).parent.parent / "output"


async def _ensure_model():
    global _whisper_model, _use_cpu
    if _whisper_model is not None:
        return

    from faster_whisper import WhisperModel

    if not _use_cpu:
        try:
            _whisper_model = await asyncio.to_thread(
                WhisperModel, WHISPER_MODEL_SIZE, device="cuda", compute_type="float16"
            )
            print("[Ears] Whisper loaded on GPU")
            return
        except Exception as e:
            print(f"[Ears] GPU failed: {e}")
            _use_cpu = True

    _whisper_model = await asyncio.to_thread(
        WhisperModel, WHISPER_MODEL_SIZE, device="cpu", compute_type="int8"
    )
    print("[Ears] Whisper loaded on CPU")


async def transcribe_file(audio_path: Path) -> str:
    await _ensure_model()
    segments, _ = await asyncio.to_thread(
        _whisper_model.transcribe, str(audio_path), beam_size=5
    )
    return " ".join(seg.text.strip() for seg in segments).strip()


async def transcribe_bytes(audio_bytes: bytes, sample_rate: int = 16000) -> str:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    suffix = ".webm" if audio_bytes[:4] == b'\x1a\x45\xdf\xa3' else ".wav"

    fd, tmp_path = tempfile.mkstemp(suffix=suffix, dir=str(OUTPUT_DIR))
    os.close(fd)
    Path(tmp_path).write_bytes(audio_bytes)

    try:
        return await transcribe_file(Path(tmp_path))
    finally:
        Path(tmp_path).unlink(missing_ok=True)
