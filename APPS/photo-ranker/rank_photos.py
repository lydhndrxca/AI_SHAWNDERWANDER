#!/usr/bin/env python3
"""
Photo Ranker — Dating Profile Photo Analyzer

Runs N independent GPT-4o vision cycles to rank photos for a dating profile,
then aggregates results as MVP-style consensus voting.
"""

import argparse
import base64
import json
import math
import os
import random
import sys
import time
from collections import Counter, defaultdict
from datetime import datetime
from io import BytesIO
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image, ExifTags

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HEIF_SUPPORT = True
except ImportError:
    HEIF_SUPPORT = False

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".heic", ".heif",
    ".webp", ".tiff", ".tif", ".bmp", ".avif",
}
MAX_DIMENSION = 1024
JPEG_QUALITY = 85

SYSTEM_PROMPT = """You are a dating profile photo analyst with deep expertise in what drives women to swipe right. You will receive photos of a single man (41, Madison WI, creative professional — principal environment artist at a video game studio, musician, former pilot). Your job is to rank every photo and select the optimal 6-photo lineup for dating apps (Hinge, Bumble, Tinder).

He is targeting women late 20s to early 40s. The profile needs to communicate: attractive, creative, adventurous, warm, emotionally available, stylish — NOT try-hard, NOT performative.

## Research-Backed Evaluation Criteria

**First photo is everything:**
- 52% of swipe decisions are made on the first photo alone (1.9 seconds average viewing time)
- 82% of attention goes to the lead photo; subsequent images get progressively less
- The lead photo MUST show his face clearly with a genuine smile and eye contact

**What women respond to (peer-reviewed research data):**
- Genuine Duchenne smile: +76% match rate vs serious/brooding expression
- Eye contact with camera: critical for trust — need it in at least 2 of 6 photos
- Outdoor / natural lighting: +22-29% vs indoor artificial light
- Activity / hobby photos: +33% match rate (shows dimension beyond looks)
- Dog photos: +37% (warmth, nurturing signal)
- Well-groomed appearance: +24%
- Confident body language (open posture, space-taking): +27% perceived attractiveness
- Simple / clean backgrounds: +19% vs cluttered environments (-28%)
- Style and fashion sense: signals personality and self-awareness
- Travel/adventure photos: signal curiosity, means, and spontaneity
- Photos with children (nieces/nephews): signal warmth and family orientation
- Candid > posed: authenticity markers outperform staged perfection

**For men 35-44 specifically:**
- "Sophisticated lifestyle" photos achieve 28.3% match rate — highest for this bracket
- Women value evidence of emotional maturity and an interesting life over raw physical attractiveness
- Photos that show competence (doing something skilled) are more attractive than photos that show appearance

**What makes HIM attractive — evaluate honestly:**
- Facial attractiveness in each specific photo (lighting, angle, expression matter enormously)
- Style/fashion choices visible in the photo
- Body language — relaxed confidence vs stiff/awkward vs trying too hard
- Does he look like someone you'd want to sit across from at dinner?
- Does he look like someone with an interesting life?

**Red flags to penalize heavily:**
- Bathroom/gym mirror selfies: -40 to -90% fewer likes
- Sunglasses hiding eyes (especially in lead photo): triggers distrust
- Group photo as first image (who is he?)
- Gym flex shots: reads as insecure
- Blurry, dark, or pixelated images: looks low-effort
- Heavy filters or face-tuning: uncanny valley, kills authenticity
- Every photo in the same setting/outfit: looks like he took them all in one day
- Someone obviously cropped out
- Arms crossed / closed body language: defensive energy
- Serious/brooding expression without context: reads as unapproachable
- Hat in EVERY photo: what is he hiding? (one or two hats is fine, but face should be clearly visible in lead)

**6-Photo Slot Framework (the STORY ARC of a profile):**
1. HEADSHOT — Clear face, genuine smile, natural light, eye contact. This single photo carries 52% of the swipe decision. Must be his most attractive, approachable image. No sunglasses. Ideally no hat so his face/hair are fully visible.
2. FULL-BODY — Natural setting, shows build and style authentically. Builds trust (avoids "catfish anxiety"). Should look candid, not posed.
3. ACTIVITY/HOBBY — Actively doing something he loves (music, outdoors, creative work). Shows he has a life beyond dating. Huge personality signal.
4. SOCIAL — With friends or family, him clearly identifiable. Social proof that real people enjoy his company. Should look natural, not staged.
5. WARM/CANDID — Laughing genuinely, with pets, in nature, relaxed moment. The "I'd feel safe with this person" photo. Emotional connection trigger.
6. WILDCARD — Travel, adventure, dressed up, something unexpected. Shows RANGE beyond the first 5. The "oh, he's interesting" photo.

**The 6 photos must tell a STORY together:**
- Different settings (indoor/outdoor, day/night, urban/nature)
- Different outfits (proves these aren't all from one photoshoot)
- Different moods (smiling, candid, active, social, contemplative)
- Progressive reveal: face → body → personality → social life → warmth → surprise
- A woman should scroll through all 6 and think "I want to know this person"

## Your Task

Look at ALL the photos provided. For EACH photo, evaluate:
1. **overall_score** (1-10): How strong is this photo for a dating profile overall?
2. **attractiveness** (1-10): How attractive does he look in THIS specific photo? Consider face, expression, body language, grooming, style, angle, lighting on his features.
3. **photo_quality** (1-10): Technical quality — lighting, composition, resolution, background.
4. **personality_signal** (1-10): How much personality/lifestyle does this photo communicate?
5. **conversation_starter** (1-10): Would a woman comment on or ask about this photo?
6. **best_slot** (1-6): Which of the 6 slots above does this photo best fit?
7. **slot_reasoning**: One sentence explaining the slot assignment.
8. **strengths**: 2-3 specific things that work about this photo.
9. **weaknesses**: 1-3 specific things that could be better (be honest, not kind).

Then select your **top 6 lineup** in order (position 1-6 mapping to the slot framework).
Explain why this combination works as a SET — the story it tells, the variety, the first-impression flow, and why a woman would swipe right after seeing all 6.

SCORING CALIBRATION: Be brutally honest. Most photos are average (5-6). Mediocre = 4-5. Bad = 2-3. Only genuinely strong photos that would make a woman stop scrolling get 8+. A 10 is near-professional quality AND maximally attractive.

Respond with valid JSON matching the schema provided."""

RESPONSE_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "photo_rankings",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "rankings": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "photo": {"type": "string"},
                            "overall_score": {"type": "number"},
                            "attractiveness": {"type": "number"},
                            "photo_quality": {"type": "number"},
                            "personality_signal": {"type": "number"},
                            "conversation_starter": {"type": "number"},
                            "best_slot": {"type": "integer"},
                            "slot_reasoning": {"type": "string"},
                            "strengths": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "weaknesses": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                        "required": [
                            "photo", "overall_score", "attractiveness",
                            "photo_quality", "personality_signal",
                            "conversation_starter", "best_slot",
                            "slot_reasoning", "strengths", "weaknesses",
                        ],
                        "additionalProperties": False,
                    },
                },
                "top_6_lineup": {
                    "type": "array",
                    "items": {"type": "string"},
                },
                "lineup_reasoning": {"type": "string"},
            },
            "required": ["rankings", "top_6_lineup", "lineup_reasoning"],
            "additionalProperties": False,
        },
    },
}

SCREENING_PROMPT = """You are a dating profile photo analyst screening photos of a man (41, Madison WI, creative professional) for dating app potential. Target audience: women late 20s to early 40s.

CRITICAL: You MUST return a rating for EVERY photo you receive. Do not skip any. Use the EXACT photo label provided.

## Research-Based Scoring Criteria

**What drives right-swipes (use these to calibrate scores):**
- Genuine Duchenne smile: +76% match rate vs serious face
- Eye contact with camera: critical trust signal
- Outdoor/natural lighting: +22-29% vs indoor
- Activity/hobby shots: +33% match rate
- Dog/pet photos: +37%
- Confident open body language: +27% perceived attractiveness
- Clean backgrounds: +19% vs cluttered (-28%)
- "Sophisticated lifestyle" for men 35-44: 28.3% match rate (highest bracket)

**Red flags (score 3 or below):**
- Mirror selfies, gym flex, blurry/dark, heavy filters, sunglasses hiding eyes, someone cropped out, arms crossed

## Scoring Guide
- 8-10: Would stop a woman scrolling. Great expression + lighting + personality signal.
- 6-7: Usable but not a standout. Decent photo, nothing special.
- 4-5: Mediocre — forgettable or has issues.
- 1-3: Bad — unflattering, poor quality, red flags.

## Slot Guide
1=Headshot (clear face, smile, eye contact)
2=Full-body (build, style, trust)
3=Activity/Hobby (doing something, personality)
4=Social (with friends/family, social proof)
5=Warm/Candid (laughing, pets, nature, approachable)
6=Wildcard (travel, dressed up, unexpected range)

## Lead Photo Potential
Also rate each photo's **lead_photo_score** (1-10): Could this be the FIRST photo a woman sees? The lead carries 52% of the swipe decision. Needs: clear face, genuine smile, eye contact, natural light, approachable energy. Sunglasses or hats hiding face = automatic low score here.

Respond with valid JSON matching the schema provided."""

SCREENING_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "photo_screening",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "ratings": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "photo": {"type": "string"},
                            "overall_score": {"type": "number"},
                            "attractiveness": {"type": "number"},
                            "lead_photo_score": {"type": "number"},
                            "best_slot": {"type": "integer"},
                            "note": {"type": "string"},
                        },
                        "required": [
                            "photo", "overall_score", "attractiveness",
                            "lead_photo_score", "best_slot", "note",
                        ],
                        "additionalProperties": False,
                    },
                },
            },
            "required": ["ratings"],
            "additionalProperties": False,
        },
    },
}

BATCH_SIZE = 20
TOP_N_FINALISTS = 25

SLOT_NAMES = {
    1: "Headshot",
    2: "Full-body",
    3: "Activity/Hobby",
    4: "Social",
    5: "Warm/Candid",
    6: "Wildcard",
}


# ---------------------------------------------------------------------------
# Image processing
# ---------------------------------------------------------------------------

def find_images(folder: Path) -> list[Path]:
    """Scan a folder for image files (non-recursive)."""
    images = []
    for f in sorted(folder.iterdir()):
        if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS:
            images.append(f)
    return images


def fix_orientation(img: Image.Image) -> Image.Image:
    """Auto-rotate based on EXIF orientation tag (common with iPhone photos)."""
    try:
        exif = img.getexif()
        orientation_key = None
        for k, v in ExifTags.TAGS.items():
            if v == "Orientation":
                orientation_key = k
                break
        if orientation_key and orientation_key in exif:
            orientation = exif[orientation_key]
            rotations = {3: 180, 6: 270, 8: 90}
            if orientation in rotations:
                img = img.rotate(rotations[orientation], expand=True)
    except Exception:
        pass
    return img


def convert_image(src: Path, out_dir: Path) -> tuple[Path, str]:
    """
    Convert any image to JPG, resize to max dimension, return (path, base64).
    """
    img = Image.open(src)
    img = fix_orientation(img)

    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGB")
    elif img.mode != "RGB":
        img = img.convert("RGB")

    w, h = img.size
    if max(w, h) > MAX_DIMENSION:
        ratio = MAX_DIMENSION / max(w, h)
        img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)

    stem = src.stem
    out_path = out_dir / f"{stem}.jpg"
    counter = 1
    while out_path.exists():
        out_path = out_dir / f"{stem}_{counter}.jpg"
        counter += 1

    img.save(out_path, "JPEG", quality=JPEG_QUALITY)

    buf = BytesIO()
    img.save(buf, "JPEG", quality=JPEG_QUALITY)
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    return out_path, b64


def process_photos(folder: Path) -> list[dict]:
    """
    Find, convert, and encode all photos in a folder.
    Returns list of {name, original, converted, base64, width, height}.
    """
    sources = find_images(folder)
    if not sources:
        print(f"\nNo images found in {folder}")
        print(f"Supported formats: {', '.join(sorted(IMAGE_EXTENSIONS))}")
        sys.exit(1)

    out_dir = folder / "_converted"
    out_dir.mkdir(exist_ok=True)

    if not HEIF_SUPPORT:
        heic_files = [s for s in sources if s.suffix.lower() in (".heic", ".heif")]
        if heic_files:
            print("\nWARNING: Found HEIC files but pillow-heif is not installed.")
            print("Install it: pip install pillow-heif")
            print("Skipping HEIC files.\n")
            sources = [s for s in sources if s.suffix.lower() not in (".heic", ".heif")]

    photos = []
    print(f"\nProcessing {len(sources)} photos...\n")

    for i, src in enumerate(sources, 1):
        try:
            out_path, b64 = convert_image(src, out_dir)
            img = Image.open(out_path)
            w, h = img.size
            label = f"Photo {i}: {src.name}"
            print(f"  [{i:>2}/{len(sources)}] {src.name:<30} -> {out_path.name} ({w}x{h})")
            photos.append({
                "label": label,
                "name": src.name,
                "original": src,
                "converted": out_path,
                "base64": b64,
                "width": w,
                "height": h,
            })
        except Exception as e:
            print(f"  [{i:>2}/{len(sources)}] {src.name:<30} -> FAILED: {e}")

    print(f"\n{len(photos)} photos ready for analysis.\n")
    return photos


# ---------------------------------------------------------------------------
# GPT-4o Vision API — Two-phase pipeline
# ---------------------------------------------------------------------------

def _build_image_content(photos: list[dict], intro_text: str) -> list[dict]:
    """Build multimodal content array with text intro + images."""
    content = [
        {
            "type": "text",
            "text": intro_text + "\n\n" + "\n".join(f"- {p['label']}" for p in photos),
        },
    ]
    for p in photos:
        content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{p['base64']}",
                "detail": "low",
            },
        })
    return content


def run_screening_batch(
    client: OpenAI, batch: list[dict], model: str, batch_num: int, total_batches: int
) -> list[dict]:
    """Phase 1: Score a batch of ~20 photos. Returns list of rating dicts."""
    intro = (
        f"Here are {len(batch)} photos (batch {batch_num}/{total_batches}). "
        f"Score EVERY SINGLE ONE — I need exactly {len(batch)} ratings back."
    )
    content = _build_image_content(batch, intro)
    messages = [
        {"role": "system", "content": SCREENING_PROMPT},
        {"role": "user", "content": content},
    ]
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            response_format=SCREENING_SCHEMA,
            temperature=1.0,
            max_tokens=8192,
        )
        data = json.loads(response.choices[0].message.content)
        ratings = data.get("ratings", [])
        print(f"    Batch {batch_num}/{total_batches}: {len(ratings)}/{len(batch)} photos scored")
        return ratings
    except Exception as e:
        print(f"    Batch {batch_num}/{total_batches}: FAILED — {e}")
        return []


def run_final_ranking(
    client: OpenAI, finalists: list[dict], model: str
) -> dict | None:
    """Phase 2: Detailed ranking + lineup selection from top candidates."""
    intro = (
        f"Here are the {len(finalists)} strongest candidate photos. "
        f"Rank ALL {len(finalists)} with detailed scores and pick the optimal 6-photo lineup."
    )
    content = _build_image_content(finalists, intro)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": content},
    ]
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            response_format=RESPONSE_SCHEMA,
            temperature=1.0,
            max_tokens=16384,
        )
        data = json.loads(response.choices[0].message.content)
        n_ranked = len(data.get("rankings", []))
        n_lineup = len(data.get("top_6_lineup", []))
        print(f"    Final: {n_ranked} photos ranked, {n_lineup}-photo lineup selected")
        return data
    except Exception as e:
        print(f"    Final ranking FAILED — {e}")
        return None


def run_cycle(client: OpenAI, all_photos: list[dict], model: str, cycle_num: int) -> dict | None:
    """Run one full two-phase ranking cycle."""
    shuffled = list(all_photos)
    random.shuffle(shuffled)

    num_batches = math.ceil(len(shuffled) / BATCH_SIZE)
    batches = [shuffled[i * BATCH_SIZE:(i + 1) * BATCH_SIZE] for i in range(num_batches)]

    print(f"  Cycle {cycle_num:>2}: screening {len(all_photos)} photos in {num_batches} batches...")

    all_screening = []
    for i, batch in enumerate(batches, 1):
        ratings = run_screening_batch(client, batch, model, i, num_batches)
        all_screening.extend(ratings)
        if i < num_batches:
            time.sleep(0.5)

    if not all_screening:
        print(f"  Cycle {cycle_num:>2}: screening failed entirely")
        return None

    label_to_name = {}
    for p in all_photos:
        label_to_name[p["label"]] = p["name"]
        label_to_name[p["name"]] = p["name"]
        stem = Path(p["name"]).stem
        label_to_name[stem] = p["name"]
        label_to_name[p["label"].lower()] = p["name"]
        label_to_name[p["name"].lower()] = p["name"]

    screening_by_name = {}
    for r in all_screening:
        raw = r.get("photo", "").strip()
        matched = label_to_name.get(raw) or label_to_name.get(raw.lower())
        if not matched:
            for key, val in label_to_name.items():
                if raw in key or key in raw:
                    matched = val
                    break
        if matched:
            score = r.get("overall_score", 0)
            lead = r.get("lead_photo_score", 0)
            combined = score * 0.7 + lead * 0.3
            r["_combined"] = combined
            if matched not in screening_by_name or combined > screening_by_name[matched].get("_combined", 0):
                screening_by_name[matched] = r

    sorted_screening = sorted(
        screening_by_name.items(),
        key=lambda x: x[1].get("_combined", 0),
        reverse=True,
    )
    finalist_names = {name for name, _ in sorted_screening[:TOP_N_FINALISTS]}

    finalists = [p for p in all_photos if p["name"] in finalist_names]
    random.shuffle(finalists)

    print(f"  Cycle {cycle_num:>2}: {len(finalists)} finalists advancing to detailed ranking...")

    result = run_final_ranking(client, finalists, model)
    if result:
        print(f"  Cycle {cycle_num:>2}: COMPLETE")
    return result


def run_all_cycles(photos: list[dict], num_cycles: int, model: str) -> list[dict]:
    """Run all independent ranking cycles."""
    load_dotenv()
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        env_path = Path(__file__).parent / ".env"
        if env_path.exists():
            load_dotenv(env_path)
            api_key = os.environ.get("OPENAI_API_KEY")

    if not api_key:
        print("\nERROR: OPENAI_API_KEY not found.")
        print("Set it as an environment variable or in .env file.")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    print(f"Running {num_cycles} independent ranking cycles ({model})...")
    print(f"  Each cycle: screen {len(photos)} photos -> top {TOP_N_FINALISTS} -> detailed ranking + lineup\n")

    results = []
    for i in range(1, num_cycles + 1):
        start = time.time()
        result = run_cycle(client, photos, model, i)
        elapsed = time.time() - start

        if result:
            results.append(result)

        print(f"  (cycle {i} took {elapsed:.0f}s)\n")

        if i < num_cycles:
            time.sleep(1)

    print(f"\n{len(results)}/{num_cycles} cycles completed successfully.\n")
    return results


# ---------------------------------------------------------------------------
# MVP voting aggregation
# ---------------------------------------------------------------------------

def aggregate_results(results: list[dict], photo_names: list[str]) -> dict:
    """
    Aggregate cycle results into MVP-style voting.
    Returns a dict with per-photo stats and consensus lineup.
    """
    num_cycles = len(results)
    stats = {}

    for name in photo_names:
        stats[name] = {
            "name": name,
            "num1_votes": 0,
            "top3_votes": 0,
            "top6_votes": 0,
            "scores": [],
            "attractiveness_scores": [],
            "quality_scores": [],
            "personality_scores": [],
            "conversation_scores": [],
            "slot_assignments": [],
            "all_strengths": [],
            "all_weaknesses": [],
        }

    for result in results:
        lineup = result.get("top_6_lineup", [])

        ranking_map = {}
        for r in result.get("rankings", []):
            photo = r.get("photo", "")
            if photo in stats:
                ranking_map[photo] = r
                stats[photo]["scores"].append(r.get("overall_score", 0))
                stats[photo]["attractiveness_scores"].append(r.get("attractiveness", 0))
                stats[photo]["quality_scores"].append(r.get("photo_quality", 0))
                stats[photo]["personality_scores"].append(r.get("personality_signal", 0))
                stats[photo]["conversation_scores"].append(r.get("conversation_starter", 0))
                stats[photo]["slot_assignments"].append(r.get("best_slot", 0))
                stats[photo]["all_strengths"].extend(r.get("strengths", []))
                stats[photo]["all_weaknesses"].extend(r.get("weaknesses", []))

        for idx, photo in enumerate(lineup):
            if photo in stats:
                stats[photo]["top6_votes"] += 1
                if idx < 3:
                    stats[photo]["top3_votes"] += 1
                if idx == 0:
                    stats[photo]["num1_votes"] += 1

    for name, s in stats.items():
        s["avg_score"] = sum(s["scores"]) / len(s["scores"]) if s["scores"] else 0
        s["avg_attractiveness"] = sum(s["attractiveness_scores"]) / len(s["attractiveness_scores"]) if s["attractiveness_scores"] else 0
        s["avg_quality"] = sum(s["quality_scores"]) / len(s["quality_scores"]) if s["quality_scores"] else 0
        s["avg_personality"] = sum(s["personality_scores"]) / len(s["personality_scores"]) if s["personality_scores"] else 0
        s["avg_conversation"] = sum(s["conversation_scores"]) / len(s["conversation_scores"]) if s["conversation_scores"] else 0

        if s["slot_assignments"]:
            slot_counts = Counter(s["slot_assignments"])
            s["consensus_slot"] = slot_counts.most_common(1)[0][0]
            s["consensus_slot_pct"] = slot_counts.most_common(1)[0][1] / len(s["slot_assignments"])
        else:
            s["consensus_slot"] = 0
            s["consensus_slot_pct"] = 0

        if s["top6_votes"] >= num_cycles * 0.7:
            s["status"] = "LOCK"
        elif s["top6_votes"] >= num_cycles * 0.5:
            s["status"] = "Strong"
        elif s["top6_votes"] >= num_cycles * 0.3:
            s["status"] = "Bubble"
        else:
            s["status"] = "Out"

        s["top_strengths"] = [
            item for item, _ in Counter(s["all_strengths"]).most_common(3)
        ]
        s["top_weaknesses"] = [
            item for item, _ in Counter(s["all_weaknesses"]).most_common(3)
        ]

    sorted_photos = sorted(
        stats.values(),
        key=lambda x: (x["top6_votes"], x["top3_votes"], x["num1_votes"], x["avg_score"]),
        reverse=True,
    )

    consensus_lineup = build_consensus_lineup(sorted_photos, num_cycles)
    lineup_reasonings = [r.get("lineup_reasoning", "") for r in results]

    return {
        "stats": {s["name"]: s for s in sorted_photos},
        "sorted": sorted_photos,
        "consensus_lineup": consensus_lineup,
        "lineup_reasonings": lineup_reasonings,
        "num_cycles": num_cycles,
    }


def build_consensus_lineup(sorted_photos: list[dict], num_cycles: int) -> list[dict]:
    """Pick the best photo for each of the 6 slots based on voting consensus."""
    lineup = []
    used = set()

    for slot in range(1, 7):
        candidates = [
            p for p in sorted_photos
            if p["consensus_slot"] == slot and p["name"] not in used and p["top6_votes"] > 0
        ]
        candidates.sort(
            key=lambda x: (x["top6_votes"], x["avg_score"]),
            reverse=True,
        )

        if candidates:
            pick = candidates[0]
        else:
            remaining = [
                p for p in sorted_photos
                if p["name"] not in used and p["top6_votes"] > 0
            ]
            if remaining:
                pick = remaining[0]
            else:
                continue

        used.add(pick["name"])
        lineup.append({
            "slot": slot,
            "slot_name": SLOT_NAMES[slot],
            "photo": pick["name"],
            "votes": pick["top6_votes"],
            "avg_score": pick["avg_score"],
            "status": pick["status"],
        })

    return lineup


# ---------------------------------------------------------------------------
# Display
# ---------------------------------------------------------------------------

def display_results(agg: dict):
    """Print the MVP voting table and recommended lineup to terminal."""
    sorted_photos = agg["sorted"]
    consensus = agg["consensus_lineup"]
    num_cycles = agg["num_cycles"]

    print("=" * 90)
    print(f"  PHOTO RANKINGS — {num_cycles} Independent Cycles")
    print("=" * 90)
    print()

    header = f"{'Photo':<28} | {'#1':>3} | {'Top3':>4} | {'Top6':>4} | {'Avg':>5} | {'Attract':>7} | {'Slot':>10} | {'Status':<8}"
    print(header)
    print("-" * len(header))

    for p in sorted_photos:
        name = p["name"][:27]
        slot_str = SLOT_NAMES.get(p["consensus_slot"], "—")
        print(
            f"{name:<28} | {p['num1_votes']:>3} | {p['top3_votes']:>4} | "
            f"{p['top6_votes']:>4} | {p['avg_score']:>5.1f} | {p['avg_attractiveness']:>7.1f} | "
            f"{slot_str:>10} | {p['status']:<8}"
        )

    print()
    print("=" * 90)
    print("  RECOMMENDED LINEUP")
    print("=" * 90)
    print()

    for entry in consensus:
        print(
            f"  Slot {entry['slot']} ({entry['slot_name']:<14}): "
            f"{entry['photo']:<28} — "
            f"{entry['votes']}/{num_cycles} votes, "
            f"avg {entry['avg_score']:.1f}"
        )

    print()
    print("-" * 90)
    print("  DETAILED BREAKDOWN")
    print("-" * 90)

    for p in sorted_photos:
        if p["top6_votes"] == 0:
            continue
        print(f"\n  {p['name']}  [{p['status']}]")
        print(f"    Overall: {p['avg_score']:.1f}  |  Attract: {p['avg_attractiveness']:.1f}  |  "
              f"Quality: {p['avg_quality']:.1f}  |  Personality: {p['avg_personality']:.1f}  |  "
              f"Convo: {p['avg_conversation']:.1f}")
        if p["top_strengths"]:
            print(f"    Strengths: {', '.join(p['top_strengths'])}")
        if p["top_weaknesses"]:
            print(f"    Weaknesses: {', '.join(p['top_weaknesses'])}")

    print()


def save_report(agg: dict, output_dir: Path):
    """Save a full markdown report."""
    output_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    report_path = output_dir / f"{ts}.md"

    sorted_photos = agg["sorted"]
    consensus = agg["consensus_lineup"]
    num_cycles = agg["num_cycles"]

    lines = [
        f"# Photo Ranking Report — {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "",
        f"**Cycles:** {num_cycles} independent evaluations",
        f"**Photos analyzed:** {len(sorted_photos)}",
        "",
        "---",
        "",
        "## MVP Voting Table",
        "",
        "| Photo | #1 | Top 3 | Top 6 | Avg Score | Attractiveness | Best Slot | Status |",
        "|-------|---:|------:|------:|----------:|---------------:|-----------|--------|",
    ]

    for p in sorted_photos:
        slot_str = SLOT_NAMES.get(p["consensus_slot"], "—")
        lines.append(
            f"| {p['name']} | {p['num1_votes']} | {p['top3_votes']} | "
            f"{p['top6_votes']} | {p['avg_score']:.1f} | {p['avg_attractiveness']:.1f} | "
            f"{slot_str} | {p['status']} |"
        )

    lines.extend([
        "",
        "---",
        "",
        "## Recommended 6-Photo Lineup",
        "",
        "| Slot | Type | Photo | Votes | Avg Score |",
        "|-----:|------|-------|------:|----------:|",
    ])

    for entry in consensus:
        lines.append(
            f"| {entry['slot']} | {entry['slot_name']} | {entry['photo']} | "
            f"{entry['votes']}/{num_cycles} | {entry['avg_score']:.1f} |"
        )

    lines.extend(["", "---", "", "## Detailed Photo Analysis", ""])

    for p in sorted_photos:
        lines.append(f"### {p['name']}  —  {p['status']}")
        lines.append("")
        lines.append(
            f"| Metric | Score |\n|--------|------:|\n"
            f"| Overall | {p['avg_score']:.1f} |\n"
            f"| Attractiveness | {p['avg_attractiveness']:.1f} |\n"
            f"| Photo Quality | {p['avg_quality']:.1f} |\n"
            f"| Personality Signal | {p['avg_personality']:.1f} |\n"
            f"| Conversation Starter | {p['avg_conversation']:.1f} |"
        )
        lines.append("")
        if p["top_strengths"]:
            lines.append(f"**Strengths:** {', '.join(p['top_strengths'])}")
        if p["top_weaknesses"]:
            lines.append(f"**Weaknesses:** {', '.join(p['top_weaknesses'])}")
        lines.append("")

    if agg["lineup_reasonings"]:
        lines.extend(["---", "", "## Cycle Lineup Reasoning", ""])
        for i, reasoning in enumerate(agg["lineup_reasonings"], 1):
            if reasoning:
                lines.append(f"**Cycle {i}:** {reasoning}")
                lines.append("")

    report_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Report saved to: {report_path}\n")
    return report_path


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Rank photos for a dating profile using GPT-4o Vision",
    )
    parser.add_argument(
        "folder",
        type=str,
        help="Path to folder containing photos",
    )
    parser.add_argument(
        "--cycles",
        type=int,
        default=10,
        help="Number of independent ranking cycles (default: 10)",
    )
    parser.add_argument(
        "--model",
        type=str,
        default="gpt-4o",
        help="Vision model to use (default: gpt-4o)",
    )

    args = parser.parse_args()
    folder = Path(args.folder).resolve()

    if not folder.is_dir():
        print(f"\nERROR: '{folder}' is not a directory.")
        sys.exit(1)

    print(f"\n{'=' * 60}")
    print(f"  Photo Ranker — Dating Profile Analyzer")
    print(f"{'=' * 60}")
    print(f"\n  Folder:  {folder}")
    print(f"  Cycles:  {args.cycles}")
    print(f"  Model:   {args.model}")

    photos = process_photos(folder)

    if len(photos) < 2:
        print("Need at least 2 photos to rank. Add more and try again.")
        sys.exit(1)

    results = run_all_cycles(photos, args.cycles, args.model)

    if not results:
        print("All cycles failed. Check your API key and try again.")
        sys.exit(1)

    photo_names = [p["name"] for p in photos]
    agg = aggregate_results(results, photo_names)

    display_results(agg)

    report_dir = Path(__file__).parent / "results"
    save_report(agg, report_dir)


if __name__ == "__main__":
    main()
