# Penteract Kaleidoscope

**Infinite Recursive 5D Fractal**

Each vertex of a penteract (5-dimensional hypercube) contains a complete smaller copy of itself, ad infinitum.

## Live Demo

Open **[index.html](index.html)** in any modern browser — fully self-contained, no dependencies.

Controls:
- **Depth** (0–3) — recursion level (depth 3 = 32³ = 32 768 points)
- **Speed** — rotation speed
- **Scale** — zoom
- Pause / Reset

## What’s inside

- `PenteractEngine` — generates the 32 vertices & edges of a 5-cube, performs 10-plane 5D rotations, and projects 5D → 2D through successive perspective steps.
- `KaleidoscopeEngine` — recursive nesting, PHI-harmonic multi-level rotations, depth-colored glowing rendering.
- Single-file HTML demo with live controls.

## Notes

- Depth 3 is already computationally heavy; higher values will lag most machines.
- PHI = (1 + √5)/2 drives the harmonic rotation frequencies and scaling.
- Pure Canvas 2D — works offline.

## Files

| File | Description |
|------|-------------|
| `index.html` | Complete runnable demo |
| `KaleidoscopeEngine.js` | Original modular engine (requires PenteractEngine) |

Enjoy the infinite mirrors.
