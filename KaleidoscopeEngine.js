/**
 * PenteractKaleidoscope: Infinite Recursive 5D Fractal
 * Each vertex contains a complete copy of itself, ad infinitum
 */
const PHI = (1 + Math.sqrt(5)) / 2;

export const KaleidoscopeEngine = {
  // Recursive vertex generation with scale factor
  generateRecursiveVertices: (depth = 3, scale = 1, offset = [0,0,0,0,0]) => {
    if (depth === 0) return [offset];
    
    const vertices = [];
    const baseVerts = PenteractEngine.generateVertices();
    
    for (let i = 0; i < 32; i++) {
      const childOffset = offset.map((coord, dim) => 
        coord + baseVerts[i][dim] * scale
      );
      
      // Recursively generate sub-structures at each vertex
      const subVerts = KaleidoscopeEngine.generateRecursiveVertices(
        depth - 1,
        scale * 0.5, // Fibonacci/PHI scaling
        childOffset
      );
      
      vertices.push(...subVerts);
    }
    
    return vertices;
  },

  // Kaleidoscopic rotation: each level rotates in different 5D planes
  recursiveRotate: (vertices, depth, time) => {
    if (depth === 0) return vertices;
    
    // Each depth level gets its own PHI-harmonic rotation
    const angleOffset = depth * PHI * 0.1;
    const angles = Array.from({length: 10}, (_, i) => 
      time * 0.2 * Math.pow(PHI, i + depth) + angleOffset
    );
    
    // Rotate this level
    let rotated = PenteractEngine.rotate(vertices, angles);
    
    // For each vertex, rotate its child structures
    // (This is the kaleidoscope effect - each point becomes a mirror)
    const chunkSize = Math.pow(32, depth);
    const result = [];
    
    for (let i = 0; i < rotated.length; i += chunkSize) {
      const chunk = rotated.slice(i, i + chunkSize);
      // Apply different rotation to each sub-chunk
      const subAngles = Array.from({length: 10}, (_, j) =>
        time * 0.2 * Math.pow(PHI, j + i * 0.01)
      );
      const subRotated = PenteractEngine.rotate(chunk, subAngles);
      result.push(...subRotated);
    }
    
    return result;
  },

  // Project with depth-based perspective warping
  projectRecursive: (v5, depth, factor = 2.5) => {
    // Each depth level gets its own projection factor (fractal zoom)
    const depthFactor = factor + depth * 0.3;
    return PenteractEngine.project(v5, depthFactor);
  },

  // Generate edges recursively (connecting corresponding vertices across depths)
  generateRecursiveEdges: (depth) => {
    if (depth === 0) return [];
    
    const edges = [];
    const baseEdges = PenteractEngine.generateEdges();
    const totalVerts = Math.pow(32, depth);
    const childSize = Math.pow(32, depth - 1);
    
    // Edges within each sub-cube
    for (let i = 0; i < totalVerts; i += childSize) {
      const subEdges = PenteractEngine.generateEdges();
      subEdges.forEach(([a, b]) => {
        edges.push([i + a, i + b]);
      });
    }
    
    // Cross-connect corresponding vertices between adjacent sub-cubes
    for (let i = 0; i < totalVerts; i += childSize) {
      for (let j = i + childSize; j < totalVerts; j += childSize) {
        // Connect every vertex in sub-cube i to its mirror in sub-cube j
        for (let k = 0; k < childSize; k++) {
          edges.push([i + k, j + k]);
        }
        // Only connect first neighbor (prevent duplicates)
        break;
      }
    }
    
    return edges;
  },

  // Render with fractal depth cues
  renderRecursive: (ctx, vertices2D, depth, width, height, scale = 100) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.clearRect(0, 0, width, height);
    
    // Generate edges for all levels
    const edges = KaleidoscopeEngine.generateRecursiveEdges(depth);
    
    // Sort vertices by depth for z-ordering
    const vertexDepth = vertices2D.map((v, i) => {
      // Estimate depth based on projection and scale
      const depthEst = Math.floor(i / Math.pow(32, depth - 1));
      return depthEst;
    });
    
    // Draw edges with depth-based styling
    edges.forEach(([i, j]) => {
      const p1 = vertices2D[i];
      const p2 = vertices2D[j];
      if (!p1 || !p2 || !p1.every(v => isFinite(v)) || !p2.every(v => isFinite(v))) return;
      
      const depth1 = vertexDepth[i] || 0;
      const depth2 = vertexDepth[j] || 0;
      const avgDepth = (depth1 + depth2) / 2;
      
      // Kaleidoscopic color based on depth and position
      const hue = (avgDepth * 30 + i * 0.1) % 360;
      const lightness = 50 + 30 * (1 - avgDepth / depth);
      const alpha = 1 - avgDepth / (depth * 1.5);
      
      ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, ${Math.max(0.1, alpha)})`;
      ctx.lineWidth = 1 + (depth - avgDepth) * 0.5;
      
      ctx.beginPath();
      ctx.moveTo(centerX + p1[0] * scale, centerY + p1[1] * scale);
      ctx.lineTo(centerX + p2[0] * scale, centerY + p2[1] * scale);
      ctx.stroke();
    });
    
    // Draw vertices as glowing points with depth color
    vertices2D.forEach((v, i) => {
      if (!v || !v.every(coord => isFinite(coord))) return;
      
      const depthEst = vertexDepth[i] || 0;
      const hue = (depthEst * 30 + i * 0.1) % 360;
      const size = 2 + (depth - depthEst) * 0.5;
      
      // Glow effect
      const gradient = ctx.createRadialGradient(
        centerX + v[0] * scale, centerY + v[1] * scale, 0,
        centerX + v[0] * scale, centerY + v[1] * scale, size * 3
      );
      gradient.addColorStop(0, `hsla(${hue}, 100%, 80%, 0.8)`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX + v[0] * scale, centerY + v[1] * scale, size * 3, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = `hsla(${hue}, 100%, 90%, 1)`;
      ctx.beginPath();
      ctx.arc(centerX + v[0] * scale, centerY + v[1] * scale, size, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
};

// Animation with infinite kaleidoscopic recursion
export class PenteractKaleidoscope {
  constructor(canvas, maxDepth = 3) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.maxDepth = maxDepth;
    this.time = 0;
    
    // Pre-generate base vertices
    this.baseVerts = PenteractEngine.generateVertices();
  }
  
  update() {
    this.time += 0.005;
    
    // Generate fractal vertices at each depth
    const allVertices = [];
    const allDepths = [];
    
    for (let d = 0; d <= this.maxDepth; d++) {
      const verts = KaleidoscopeEngine.generateRecursiveVertices(d, 1 / Math.pow(2, d));
      const projected = verts.map(v => 
        KaleidoscopeEngine.projectRecursive(v, d, 2.5 + d * 0.2)
      );
      
      // Apply kaleidoscopic rotation
      const rotated = KaleidoscopeEngine.recursiveRotate(projected, d, this.time);
      allVertices.push(...rotated);
      
      // Track depth for rendering
      for (let i = 0; i < rotated.length; i++) {
        allDepths.push(d);
      }
    }
    
    // Render everything
    KaleidoscopeEngine.renderRecursive(
      this.ctx,
      allVertices,
      this.maxDepth,
      this.canvas.width,
      this.canvas.height,
      150 / Math.pow(2, 0.5) // Auto-scaling
    );
    
    requestAnimationFrame(() => this.update());
  }
  
  start() {
    this.update();
  }
}