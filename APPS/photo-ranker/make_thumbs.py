"""Generate review thumbnails: max 896px long edge, JPEG q85."""
from __future__ import annotations
import sys
from pathlib import Path
from PIL import Image, ImageOps

MAX_EDGE = 896
QUALITY = 85


def main() -> int:
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in src.iterdir() if p.suffix.lower() == ".jpg")
    for p in files:
        img = Image.open(p)
        img = ImageOps.exif_transpose(img)
        img.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        out = dst / p.name
        img.convert("RGB").save(out, "JPEG", quality=QUALITY, optimize=True)
    print(f"wrote {len(files)} thumbs -> {dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
