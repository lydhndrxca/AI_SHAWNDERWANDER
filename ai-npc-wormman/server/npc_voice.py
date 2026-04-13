"""Worm Man's voice — Kokoro TTS wrapper."""

import io
import struct
import wave
import tempfile
import asyncio
from pathlib import Path

_kokoro = None
_voice_style = None

SAMPLE_RATE = 24000
VOICE_NAME = "bf_emma"  # gruff-ish female/british voice; swap to find best Worm Man fit
SPEED = 1.05


async def _ensure_loaded():
    """Lazy-load Kokoro model on first use."""
    global _kokoro, _voice_style
    if _kokoro is not None:
        return

    import kokoro_onnx  # noqa: delayed import so server starts fast
    _kokoro = await asyncio.to_thread(kokoro_onnx.Kokoro, "kokoro-v1.0.onnx", "voices-v1.0.bin")
    _voice_style = VOICE_NAME


async def synthesize(text: str, output_path: Path | None = None) -> Path:
    """Convert text to WAV audio file. Returns path to the WAV."""
    await _ensure_loaded()

    samples, sr = await asyncio.to_thread(
        _kokoro.create, text, voice=_voice_style, speed=SPEED
    )

    if output_path is None:
        fd, tmp = tempfile.mkstemp(suffix=".wav", dir=str(Path(__file__).parent.parent / "output"))
        output_path = Path(tmp)
        import os; os.close(fd)

    _write_wav(output_path, samples, sr)
    return output_path


def _write_wav(path: Path, samples, sample_rate: int):
    """Write float32 samples to a 16-bit PCM WAV file."""
    import numpy as np
    pcm = (samples * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm.tobytes())
