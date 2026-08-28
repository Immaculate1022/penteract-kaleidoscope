# Penteract Kaleidoscope

**Infinite Recursive 5D Fractal**

Each vertex of a penteract (5-dimensional hypercube) contains a complete copy of itself, ad infinitum.

## Features

- Recursive vertex generation with scale factor
- Kaleidoscopic rotation: each level rotates in different 5D planes using PHI-harmonic angles
- Depth-based perspective warping and fractal zoom
- Recursive edge generation connecting corresponding vertices across depths
- Canvas rendering with depth cues, glowing points, and hsla color based on depth/position

## Usage

This module depends on a `PenteractEngine` (not included here) that provides:

- `generateVertices()`
- `generateEdges()`
- `rotate(vertices, angles)`
- `project(v5, factor)`

```js
import { KaleidoscopeEngine, PenteractKaleidoscope } from './KaleidoscopeEngine.js';

const canvas = document.getElementById('canvas');
const kaleido = new PenteractKaleidoscope(canvas, 3); // maxDepth = 3
kaleido.start();
```

## Notes

- Depth defaults to 3 (32^3 = 32,768 vertices at deepest level — use carefully).
- PHI = (1 + √5) / 2 drives harmonic rotations and scaling.
- Designed for browser Canvas 2D context.

## License

See repository license.
