# Tool-First Development

## The Core Idea

Don't ask AI to make the thing. Ask AI to make the **tool** that makes the thing.

## The Old Way: Problem → Prompt

You have a vision. You prompt AI to generate it. The result is close but not right. You prompt again with adjustments. And again. And again. You're playing a slot machine — pulling the handle, hoping the next generation lands on what you see in your head. Each iteration costs time and context. After ten attempts you settle for "close enough" because you've lost the thread.

## The New Way: Problem → Tool

You have a vision. You prompt AI to build you an **editor** — a live, interactive tool where you can manipulate the parameters yourself. Sliders, toggles, color pickers, preview panes. You use the tool as a designer, dialing in exactly what you want. One prompt builds the tool. Infinite adjustments happen in your hands.

## Why This Works

- **You are the designer.** AI is fast but it can't see what's in your head. A tool puts the controls in your hands where creative judgment lives.
- **Feedback is instant.** No round-trip to a prompt. Move a slider, see the result. The iteration loop drops from minutes to milliseconds.
- **Parameters are saveable.** The tool writes to a config file (JSON, YAML, whatever). The config drives the actual system. You can version it, share it, revert it.
- **The tool is throwaway.** It doesn't need to be pretty. It doesn't ship. It exists to serve your creative process, then it gets out of the way.
- **One prompt vs. many.** Building the tool is one focused prompt. Using the tool is unlimited free iterations with zero token cost.

## When to Apply This

Ask yourself: **am I about to prompt the same system more than three times to get it right?**

If yes, stop. Prompt a tool instead.

Examples:

| Slot Machine Approach | Tool-First Approach |
|---|---|
| "Generate a terrain with rolling hills and scattered trees" × 10 | "Build me a terrain editor with sliders for hill frequency, amplitude, tree density, and a live 3D preview" |
| "Make the text color more readable" × 5 | "Build a theme editor with live preview that saves to a CSS variables file" |
| "Adjust the difficulty curve so hole 5 feels harder" × 8 | "Build a difficulty tuner UI — sliders for each hole's micro-thought timer, thought pool mix, and panic threshold, with a chart showing the curve" |
| "Generate a character portrait — sharper jaw, darker hair" × 15 | "Build a character creator with parameter controls that exports to the sprite system" |
| "Write dialogue that's drier and more corporate" × 6 | "Build a tone calibration tool — show sample lines at different points on a tone spectrum, let me pick the register I want, save to config" |

## How to Prompt for Tools

When asking AI to build a tool, include:

1. **What you're controlling.** Name the parameters. Be specific.
2. **How you want to see the result.** Live preview? Before/after? Chart? Just numbers?
3. **Where it saves.** JSON file? Inline in the source? LocalStorage?
4. **That it's a dev tool.** It doesn't need to be polished. Function over form. No auth, no deployment, no error handling beyond "don't crash."

Example prompt:
> Build me a dev tool for tuning the micro-thought system. I need sliders for: timer duration (500ms–5000ms), number of thoughts shown (3–8), quality modifier range, and category weight distribution. Show a live mock of what the thought grid looks like at current settings. Save all values to a JSON file I can load at runtime.

## The Principle

**AI generates. You curate.** A tool is the interface between generation and curation. Without it, you're outsourcing your taste to a language model. With it, you're using a language model to amplify your taste.

Prompt the tool. Use the tool. Ship the result.
