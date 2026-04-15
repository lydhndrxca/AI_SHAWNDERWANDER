"""Worm Man's brain — Ollama LLM integration with abliterated models and memory."""

import json
import httpx
from pathlib import Path

OLLAMA_URL = "http://localhost:11434/api/chat"

# Abliterated models with character baked into Modelfile — no censorship
MODELS = {
    "14b": "wormman:14b",
    "32b": "wormman:32b",
}
DEFAULT_SIZE = "14b"
MAX_MEMORY = 20

_active_size: str = DEFAULT_SIZE
_character = None
_history: list[dict] = []


def get_model() -> str:
    return MODELS[_active_size]


def get_model_size() -> str:
    return _active_size


def set_model_size(size: str) -> str:
    global _active_size
    size = size.strip().lower()
    if size in MODELS:
        _active_size = size
    return _active_size


def _load_character() -> dict:
    global _character
    if _character is None:
        path = Path(__file__).parent / "character.json"
        with open(path, "r", encoding="utf-8") as f:
            _character = json.load(f)
    return _character


async def _check_model(client: httpx.AsyncClient, model: str) -> bool:
    try:
        resp = await client.get("http://localhost:11434/api/tags", timeout=5)
        if resp.status_code == 200:
            models = [m["name"] for m in resp.json().get("models", [])]
            return any(model in m for m in models)
    except Exception:
        pass
    return False


async def _resolve_model(client: httpx.AsyncClient) -> str | None:
    """Find the best available wormman model, preferring the active size."""
    primary = MODELS[_active_size]
    if await _check_model(client, primary):
        return primary
    for size, model in MODELS.items():
        if size != _active_size and await _check_model(client, model):
            return model
    return None


async def chat(user_message: str) -> str:
    """Send a message to Worm Man and get his response."""
    global _history

    _history.append({"role": "user", "content": user_message})

    if len(_history) > MAX_MEMORY * 2:
        _history = _history[-(MAX_MEMORY * 2):]

    # wormman:* models have the system prompt baked into the Modelfile,
    # so we only send conversation history — no system message override needed.
    messages = list(_history)

    async with httpx.AsyncClient() as client:
        model = await _resolve_model(client)
        if model is None:
            return (
                "*slurp* Listen, Worm Man's brain isn't connected right now. "
                "Create the model first: ollama create wormman:14b -f Modelfile.14b"
            )

        try:
            resp = await client.post(
                OLLAMA_URL,
                json={"model": model, "messages": messages, "stream": False},
                timeout=120,
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
