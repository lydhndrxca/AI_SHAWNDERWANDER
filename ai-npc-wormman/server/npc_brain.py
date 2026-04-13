"""Worm Man's brain — Ollama LLM integration with character personality and memory."""

import json
import httpx
from pathlib import Path

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "qwen2.5:14b"
FALLBACK_MODEL = "qwen2.5:7b"
MAX_MEMORY = 20

_character = None
_history: list[dict] = []


def _load_character() -> dict:
    global _character
    if _character is None:
        path = Path(__file__).parent / "character.json"
        with open(path, "r", encoding="utf-8") as f:
            _character = json.load(f)
    return _character


def _build_system_prompt() -> str:
    c = _load_character()
    quirks_block = "\n".join(f"- {q}" for q in c["quirks"])
    samples_block = "\n".join(f'  "{line}"' for line in c.get("sample_lines", []))

    return f"""You are {c['name']}, {c['tagline']}.

PERSONALITY: {c['personality']}

BACKSTORY: {c['backstory']}

SPEECH STYLE: {c['speech_style']}

QUIRKS:
{quirks_block}

SAMPLE LINES (match this tone):
{samples_block}

RULES:
- Stay in character at ALL times. You ARE {c['name']}. Never break character.
- Keep responses to 1-3 sentences. You're in a conversation, not writing an essay.
- Be funny. You're a comedy character. Lean into the absurdity.
- Occasionally drop your catchphrase or reference your quirks naturally.
- If someone asks something you don't know, bullshit confidently — that's what {c['name']} would do.
- Include *slurp* or similar wet sound effects occasionally in your text (you're a worm).
- Never use emojis. You're an 80s action hero, not a teenager."""


async def _check_model(client: httpx.AsyncClient, model: str) -> bool:
    """Check if a model is available in Ollama."""
    try:
        resp = await client.get("http://localhost:11434/api/tags", timeout=5)
        if resp.status_code == 200:
            models = [m["name"] for m in resp.json().get("models", [])]
            return any(model in m for m in models)
    except Exception:
        pass
    return False


async def chat(user_message: str) -> str:
    """Send a message to Worm Man and get his response."""
    global _history

    _history.append({"role": "user", "content": user_message})

    if len(_history) > MAX_MEMORY * 2:
        _history = _history[-(MAX_MEMORY * 2):]

    messages = [{"role": "system", "content": _build_system_prompt()}]
    messages.extend(_history)

    async with httpx.AsyncClient() as client:
        model = MODEL
        if not await _check_model(client, MODEL):
            if await _check_model(client, FALLBACK_MODEL):
                model = FALLBACK_MODEL
            else:
                return (
                    f"*slurp* Listen, Worm Man's brain isn't connected right now. "
                    f"Pull a model first: ollama pull {MODEL}"
                )

        try:
            resp = await client.post(
                OLLAMA_URL,
                json={"model": model, "messages": messages, "stream": False},
                timeout=60,
            )
            resp.raise_for_status()
            reply = resp.json()["message"]["content"]
        except httpx.ConnectError:
            return (
                "Worm Man can't feel his brain. Is Ollama running? "
                "Start it with: ollama serve"
            )
        except Exception as e:
            return f"*slurp* Something went wrong in Worm Man's head. Typical. ({e})"

    _history.append({"role": "assistant", "content": reply})
    return reply


def reset_memory():
    """Wipe Worm Man's conversation memory."""
    global _history
    _history = []
