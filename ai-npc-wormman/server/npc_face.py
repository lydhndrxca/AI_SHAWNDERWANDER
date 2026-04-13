"""Worm Man's face — IMTalker integration for lip-synced video.

Falls back to a static portrait + audio overlay if IMTalker isn't available,
so the app still works while IMTalker is being set up.
"""

import asyncio
import shutil
import subprocess
import tempfile
from pathlib import Path

IMTALKER_DIR = Path(__file__).parent.parent / "imtalker"
PORTRAIT_PATH = Path(__file__).parent.parent / "assets" / "wormman.png"
OUTPUT_DIR = Path(__file__).parent.parent / "output"

_imtalker_available: bool | None = None


def _check_imtalker() -> bool:
    """Check if IMTalker repo is cloned and runnable."""
    global _imtalker_available
    if _imtalker_available is not None:
        return _imtalker_available

    app_py = IMTALKER_DIR / "app.py"
    inference_py = IMTALKER_DIR / "inference.py"
    _imtalker_available = app_py.exists() or inference_py.exists()
    return _imtalker_available


async def generate_video(audio_path: Path, output_name: str | None = None) -> Path:
    """Generate lip-synced video from audio + portrait.

    Returns path to the output MP4 (or a fallback video with static image + audio).
    """
    if output_name is None:
        output_name = f"wormman_{int(asyncio.get_event_loop().time() * 1000)}.mp4"

    output_path = OUTPUT_DIR / output_name
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if _check_imtalker():
        return await _run_imtalker(audio_path, output_path)
    else:
        return await _fallback_ffmpeg(audio_path, output_path)


async def _run_imtalker(audio_path: Path, output_path: Path) -> Path:
    """Run IMTalker inference to produce lip-synced video."""
    inference_script = IMTALKER_DIR / "inference.py"
    if not inference_script.exists():
        inference_script = IMTALKER_DIR / "app.py"

    cmd = [
        "python", str(inference_script),
        "--source_image", str(PORTRAIT_PATH),
        "--driven_audio", str(audio_path),
        "--result_dir", str(output_path.parent),
    ]

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(IMTALKER_DIR),
        )
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=120)

        if proc.returncode != 0:
            print(f"[Face] IMTalker failed (rc={proc.returncode}): {stderr.decode()[:500]}")
            return await _fallback_ffmpeg(audio_path, output_path)

        result_files = list(output_path.parent.glob("*.mp4"))
        if result_files:
            latest = max(result_files, key=lambda f: f.stat().st_mtime)
            if latest != output_path:
                shutil.move(str(latest), str(output_path))
            return output_path

    except asyncio.TimeoutError:
        print("[Face] IMTalker timed out after 120s")
    except Exception as e:
        print(f"[Face] IMTalker error: {e}")

    return await _fallback_ffmpeg(audio_path, output_path)


async def _fallback_ffmpeg(audio_path: Path, output_path: Path) -> Path:
    """Create a video with the static portrait and the audio track using ffmpeg.
    Works without IMTalker — the character just doesn't move their mouth.
    """
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        try:
            import imageio_ffmpeg
            ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        except ImportError:
            pass
    if not ffmpeg:
        print("[Face] ffmpeg not found — returning audio only")
        shutil.copy(str(audio_path), str(output_path.with_suffix(".wav")))
        return audio_path

    portrait = str(PORTRAIT_PATH)
    if not PORTRAIT_PATH.exists():
        portrait = str(_create_placeholder_portrait())

    cmd = [
        ffmpeg, "-y",
        "-loop", "1", "-i", portrait,
        "-i", str(audio_path),
        "-c:v", "libx264", "-tune", "stillimage",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-shortest",
        str(output_path),
    ]

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    await proc.communicate()
    return output_path


def _create_placeholder_portrait() -> Path:
    """Generate a simple placeholder image if no portrait exists."""
    try:
        from PIL import Image, ImageDraw, ImageFont
        img = Image.new("RGB", (512, 512), (40, 20, 60))
        draw = ImageDraw.Draw(img)
        draw.text((120, 220), "WORM MAN", fill=(255, 200, 0))
        draw.text((140, 260), "(portrait pending)", fill=(180, 180, 180))
        path = PORTRAIT_PATH.parent / "wormman_placeholder.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(str(path))
        return path
    except ImportError:
        import struct
        path = PORTRAIT_PATH.parent / "wormman_placeholder.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        # Minimal 1x1 purple PNG
        path.write_bytes(
            b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
            b'\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00'
            b'\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00'
            b'\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        )
        return path
