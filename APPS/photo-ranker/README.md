# Photo Ranker — Dating Profile Photo Analyzer

Ranks your photos for dating profile use by running 10 independent GPT-4o vision analysis cycles and presenting results as MVP-style consensus voting.

## Setup

```bash
cd APPS/photo-ranker
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and add your OpenAI API key:

```bash
cp .env.example .env
# edit .env with your key
```

## Usage

```bash
# Point at a folder of photos
python rank_photos.py ~/Desktop/dating-photos

# Custom number of cycles
python rank_photos.py ~/Desktop/dating-photos --cycles 5

# Use a different model
python rank_photos.py ~/Desktop/dating-photos --model gpt-4o-mini
```

## What it does

1. Scans the folder for images (JPG, PNG, HEIC, WEBP, TIFF, BMP, AVIF — anything)
2. Converts everything to JPG (handles iPhone HEIC automatically)
3. Sends all photos to GPT-4o Vision 10 times independently
4. Each cycle ranks every photo and picks a top-6 lineup for dating apps
5. Aggregates into MVP-style voting — consensus across independent opinions

## Output

- Terminal table showing vote counts, scores, and consensus status
- Recommended 6-photo lineup with slot assignments
- Full markdown report saved to `results/`

## Cost

Roughly $0.50-$1.50 per run with 10-20 photos at 10 cycles.
