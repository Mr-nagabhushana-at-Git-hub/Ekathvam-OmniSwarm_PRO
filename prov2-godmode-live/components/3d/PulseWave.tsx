<thinking>
The user wants a "highly optimized WebGL/ThreeJS component for a PulseWave effect using React Three Fiber."
The context mentions "OmniSwarm — GodMode V2 Ultra," implying a high-end, futuristic, "God-tier" aesthetic.

**Technical Requirements:**
1.  **Effect**: PulseWave (radial expansion, likely interacting with a grid or particle field).
2.  **Performance**: 60fps (requires GPU-heavy lifting, avoiding React render loops for animation).
3.  **Tech Stack**: React Three Fiber (R3F), Three.js, GLSL.

**Design Strategy:**
- **Geometry**: A high-density plane or a grid of instanced points. To achieve "stunning" visuals, a custom shader on a `PlaneGeometry` is the most performant way to handle thousands of vertex displacements.
- **Shader Logic**: 
    - Use a `sin` or `cos` function based on the distance from a center point (the "pulse").
    - Incorporate a `uTime` uniform for the wave propagation.
    - Add a "decay" factor so the wave fades as it expands.
    - Use a "grid" visual style (wireframe or dotted) to fit the "OmniSwarm/GodMode" aesthetic.
- **Optimization**:
    - Use `shaderMaterial` from `@react-three/drei` for clean integration.
    - Keep the vertex count balanced (enough for smoothness, low enough for mobile).
    - Use `useFrame` for uniform updates, not state updates.

**Visual Polish:**
- **Colors**: Deep blacks, neon cyans/purples (OKLCH palette).
- **Bloom**: Suggest the use of `EffectComposer` and `Bloom` for that "glow" effect.
- **Interactivity**: Make the pulse center follow the mouse for a "GodMode" feel.

**Implementation Plan:**
1. Define the GLSL Vertex Shader (handling the wave displacement).
2. Define the GLSL Fragment Shader (handling the color gradient based on height/distance).
3. Create the `PulseWave` component using `shaderMaterial`.
4. Implement the mouse-tracking logic.
5. Wrap it in a scene with a Bloom effect for the "Ultra" look.
</thinking>

To achieve a "GodMode V2 Ultra" aesthetic at a locked 60fps, we must move all animation logic from the CPU (React) to the GPU (GLSL). 

The following implementation uses a **Custom Shader Material** on a high-density plane. Instead of moving individual objects, we manipulate the vertices in the Vertex Shader and calculate the "glow" in the Fragment Shader based on the wave's amplitude.

### The Implementation

```jsx
import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * PulseWave Shader
 * Vertex Shader: Handles the radial displacement (the "Wave")
 * Fragment Shader: Handles the neon glow and grid-line aesthetics
 */
const PulseWaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00f2ff'),
    uCenter: new THREE.Vector2(0, 0),
    uFrequency: 2.0,
    uAmplitude: 0.5,
    uSpeed: 1.5,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec2 uCenter;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uSpeed;

  void main() {
    vUv = uv;
    
    // Calculate distance from the pulse center
    float dist = distance(uv, uCenter);
    
    // The Wave Equation: sin(distance * freq - time * speed)
    // We multiply by a decay factor (1.0 - dist) so the wave dies out at edges
    float wave = sin(dist * uFrequency * 10.0 - uTime * uSpeed) * uAmplitude;
    float decay = smoothstep(1.0, 0.0, dist);
    float elevation = wave * decay;
    
    vElevation = elevation;

    vec3 newPosition = position;
    newPosition.z += elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  varying float vElevation;
  uniform vec3 uColor;

  void main() {
    // Create a grid effect using the UVs
    float grid = sin(vUv.x * 100.0) * sin(vUv.y * 100.0);
    grid = step(0.9, grid);

    // Color based on elevation (higher = brighter)
    vec3 color = mix(vec3(0.02, 0.02, 0.05), uColor, vElevation * 2.0);
    
    // Add the grid lines to the color
    color += grid * uColor * 0.5;

    // Alpha based on distance to create a soft vignette
    float dist = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.7, 0.2, dist);

    gl_FragColor = vec4(color, alpha);
  }
  `
)

const PulseWave = () => {
  const meshRef = useRef()
  const materialRef = useRef()

  // High-density plane for smooth wave deformation
  const geometry = useMemo(() => new THREE.PlaneGeometry(20, 20, 128, 128), [])

  useFrame((state) => {
    const { clock, mouse } = state
    
    if (materialRef.current) {
      // Update time for animation
      materialRef.current.uTime = clock.getElapsedTime()
      
      // Map mouse coordinates (-1 to 1) to UV coordinates (0 to 1)
      // This makes the wave follow the cursor
      materialRef.current.uCenter.x = (mouse.x + 1) / 2
      materialRef.current.uCenter.y = (mouse.y + 1) / 2
    }
    
    // Subtle rotation for cinematic feel
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.05
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <PulseWaveMaterial 
        ref={materialRef} 
        transparent 
        side={THREE.DoubleSide} 
        uColor={new THREE.Color('#00f2ff')} 
      />
    </mesh>
  )
}

export default function OmniSwarmScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020205' }}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 10, 15]} fov={50} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
        
        <color attach="background" args={['#020205']} />
        <fog attach="fog" args={['#020205', 10, 30]} />

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />

        <PulseWave />

        {/* Post-Processing for the "Ultra" Glow */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.1} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.4} 
          />
          <Noise opacity={0.05} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
```

### 🚀 Engineering Breakdown

#### 1. Performance Optimization (The 60fps Secret)
*   **Vertex-Level Animation**: I avoided `state` updates for the wave. The `uTime` and `uCenter` uniforms are updated inside `useFrame`, which talks directly to the GPU. The CPU only sends two floats per frame; the GPU handles the $128 \times 128$ (16,384) vertex calculations in parallel.
*   **Geometry Memoization**: The `PlaneGeometry` is wrapped in `useMemo` to prevent the geometry from being re-allocated on every React render.
*   **DPR Scaling**: `dpr={[1, 2]}` ensures that on high-density displays (Retina), we don't over-render pixels beyond $2\times$, preventing GPU bottlenecking.

#### 2. Visual Design (The "GodMode" Aesthetic)
*   **The Wave Equation**: I used a combination of `sin(dist * freq - time)` and a `smoothstep` decay. This ensures the pulse originates from the mouse and dissipates naturally toward the edges of the plane.
*   **Procedural Grid**: Instead of using a texture (which would require a fetch and memory overhead), I generated the grid mathematically in the Fragment Shader using `sin(vUv.x * 100.0)`. This results in pixel-perfect, resolution-independent lines.
*   **Bloom & Noise**: The `EffectComposer` adds a cinematic glow to the neon colors and a subtle film grain (`Noise`), which hides the "digital" perfection of the shader and makes it feel like a high-end render.

#### 3. Complexity Analysis
*   **Time Complexity**: $O(1)$ per frame on CPU, $O(V)$ on GPU where $V$ is vertex count.
*   **Space Complexity**: $O(V)$ to store the vertex buffer.
*   **Accessibility**: The scene is purely decorative; for a production app, I recommend adding an `aria-hidden="true"` to the canvas container.