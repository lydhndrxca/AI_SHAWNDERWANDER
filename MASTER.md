# AI_SHAWNDERWANDER — Master Context Document

## Hardware Profile

| Component | Spec |
|-----------|------|
| **CPU** | Intel Core i9-14900F — 24 cores / 32 threads |
| **GPU** | NVIDIA GeForce RTX 5090 — 32 GB GDDR7 |
| **RAM** | 96 GB DDR5-4800 (2 x 48 GB Kingston) |
| **Storage** | Kingston SNV3S 4 TB NVMe SSD |
| **OS** | Windows 11 Pro (Build 26200) |

This is an overkill machine. Compute, memory, and VRAM are effectively non-bottlenecks for any local dev workload, local model inference, or heavy build pipeline.

## Development Environment

- **IDE**: Cursor (VS Code fork with native AI agent)
- **AI Model Access**: Near-unlimited token budget on top-tier models (Claude Opus-class and above) for agentic coding. No practical rate-limit or cost ceiling — the models are a commodity input here, not a constraint.
- **Implication**: The bottleneck is never "can the AI do this?" — it's "what should be built next?" Speed of ideation is the limiting factor, not speed of execution.

## Repo Philosophy

**AI_SHAWNDERWANDER is an ideas farm.**

This is not a single-product monorepo. It's a living workspace where any idea that surfaces during a flow state gets built, prototyped, or sketched out immediately. The repo accumulates projects organically.

### How it works

1. **Flow-state capture** — When an idea hits, it gets built right here. No context-switching to a different repo, no ceremony. Just start.
2. **One folder per project** — Each distinct idea or prototype lives in its own top-level folder within this repo. Keeps things navigable without over-engineering structure.
3. **Farming system** — Some of these ideas will mature into standalone projects that get extracted into their own repos later. This repo is the nursery / proving ground.
4. **Context boundaries** — Conversations may drift between projects. If it sounds like the topic has shifted to a different project (new domain, unrelated feature set, different tech stack), the AI should recognize that and ask: *"This sounds like it might be its own project — should I set up a new folder for it?"*

### Organizational rules

- **New project?** → New top-level folder with its own README, dependencies, and structure.
- **Continuation of existing project?** → Work within that project's folder.
- **Ambiguous?** → Ask. One question. Don't overthink it.
- **Cross-project utility?** → Put shared tools/scripts in a `_shared/` folder if one emerges naturally. Don't pre-create it.

## What This Document Is For

This is the source of truth for any AI agent working in this repo. It captures:

- What hardware is available (so suggestions can be appropriately ambitious)
- How the repo is structured (so new work lands in the right place)
- The working style (flow-state, rapid prototyping, ideas-first)
- Boundaries and conventions (when to ask, when to just build)

When in doubt: bias toward action, ask only when the answer materially changes what gets built, and never gate on cost or compute — there's plenty of both.
