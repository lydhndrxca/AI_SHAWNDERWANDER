"""Convert any image format to JPG and remove visual duplicates.

Usage:
    python prep_photos.py <source_folder> <dest_folder>

Steps:
1. Walk source_folder for image files (any case extension)
2. Convert HEIC/PNG/etc to JPG (quality 92)
3. Drop byte-identical duplicates (sha256)
4. Drop visual duplicates via perceptual hash (phash, hamming distance <= 4)
5. Write survivors to dest_folder with original stem (deconflicting collisions)
"""

from __future__ import annotations

import argparse
import hashlib
import sys
from pathlib import Path

from PIL import Image, ImageOps
import pillow_heif
import imagehash

pillow_heif.register_heif_opener()

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp", ".tiff", ".bmp", ".avif"}
PHASH_THRESHOLD = 4  # hamming distance; <=4 ≈ visually identical / near-dup


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def load_as_rgb(path: Path) -> Image.Image:
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if img.mode != "RGB":
        img = img.convert("RGB")
    return img


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("sources", type=Path, nargs="+", help="One or more source folders")
    ap.add_argument("--dest", type=Path, required=True)
    ap.add_argument("--quality", type=int, default=92)
    ap.add_argument("--phash-threshold", type=int, default=PHASH_THRESHOLD)
    args = ap.parse_args()

    srcs: list[Path] = args.sources
    dst: Path = args.dest
    for s in srcs:
        if not s.is_dir():
            print(f"ERROR: source not found: {s}", file=sys.stderr)
            return 1
    dst.mkdir(parents=True, exist_ok=True)

    files: list[Path] = []
    for s in srcs:
        files.extend(p for p in sorted(s.iterdir()) if p.is_file() and p.suffix.lower() in IMAGE_EXTS)
    print(f"Found {len(files)} image files across {len(srcs)} source(s)")

    # Step 1: byte-level dedupe (cheap, catches "(1)" copies)
    seen_sha: dict[str, Path] = {}
    after_byte: list[Path] = []
    byte_dupes: list[tuple[Path, Path]] = []
    for p in files:
        h = sha256_file(p)
        if h in seen_sha:
            byte_dupes.append((p, seen_sha[h]))
        else:
            seen_sha[h] = p
            after_byte.append(p)
    print(f"After byte-dedupe: {len(after_byte)} ({len(byte_dupes)} exact-byte dupes removed)")

    # Step 2: perceptual hash dedupe
    kept: list[tuple[Path, imagehash.ImageHash, Image.Image]] = []
    visual_dupes: list[tuple[Path, Path, int]] = []
    for p in after_byte:
        try:
            img = load_as_rgb(p)
        except Exception as e:
            print(f"  skip (load fail): {p.name} :: {e}")
            continue
        ph = imagehash.phash(img)
        match = None
        for kp, kh, _ in kept:
            d = ph - kh
            if d <= args.phash_threshold:
                match = (kp, d)
                break
        if match is not None:
            visual_dupes.append((p, match[0], match[1]))
        else:
            kept.append((p, ph, img))

    print(f"After visual-dedupe: {len(kept)} ({len(visual_dupes)} visual dupes removed)")

    # Step 3: write JPGs
    used_names: set[str] = set()
    written = 0
    for p, _, img in kept:
        stem = p.stem
        # strip "(1)", "(2)" suffixes from filenames if present
        if stem.endswith(")") and "(" in stem:
            stem = stem.rsplit("(", 1)[0].rstrip()
        name = f"{stem}.jpg"
        i = 1
        while name.lower() in used_names:
            name = f"{stem}_{i}.jpg"
            i += 1
        used_names.add(name.lower())
        out_path = dst / name
        img.save(out_path, "JPEG", quality=args.quality, optimize=True)
        written += 1

    print(f"\nWrote {written} JPGs -> {dst}")
    if byte_dupes:
        print(f"\nByte-identical duplicates dropped:")
        for dup, orig in byte_dupes:
            print(f"  {dup.name}  ==  {orig.name}")
    if visual_dupes:
        print(f"\nVisual near-duplicates dropped (phash distance shown):")
        for dup, orig, d in visual_dupes:
            print(f"  {dup.name}  ~~  {orig.name}  (d={d})")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
