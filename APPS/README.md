# APPS — Dating Profile Optimizer

Automated dating profile builder across 7 platforms. Research-backed photo selection, bio writing, and prompt optimization — all tuned per-platform.

## Platforms

| App | Status |
|-----|--------|
| Tinder | Setup |
| Bumble | Setup |
| Hinge | Setup |
| Feeld | Setup |
| Coffee Meets Bagel | Setup |
| The League | Setup |
| Facebook Dating | Setup |

## Project Structure

```
APPS/
├── README.md              ← You are here
├── PLATFORMS.md            ← Full specs per app (limits, prompts, features)
├── STRATEGY.md             ← Research-backed optimization playbook
├── MY_PROFILE.md           ← Your personality, preferences, raw material
└── profiles/               ← Generated profile content per platform
    ├── tinder.md
    ├── bumble.md
    ├── hinge.md
    ├── feeld.md
    ├── coffee-meets-bagel.md
    ├── the-league.md
    └── facebook-dating.md
```

## Workflow

1. **PLATFORMS.md** — Reference specs locked in (photo limits, char limits, available prompts)
2. **STRATEGY.md** — Data-backed best practices per platform
3. **MY_PROFILE.md** — Fill in personality, interests, what you're looking for, photo inventory
4. **profiles/** — AI generates optimized content per platform, tailored to each app's constraints and audience
