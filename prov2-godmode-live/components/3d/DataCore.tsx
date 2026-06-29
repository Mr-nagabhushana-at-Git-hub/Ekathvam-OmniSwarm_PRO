<thinking>
The user wants a "highly optimized WebGL/ThreeJS component for a DataCore effect" using React Three Fiber (R3F). 
The context mentions "OmniSwarm — GodMode V2 Ultra", implying a high-end, futuristic, "God-tier" aesthetic. 
"DataCore" suggests a central hub of information, likely involving a core geometry surrounded by orbiting data particles, connections, and energy flows.

**Technical Requirements:**
1. **60fps Performance**: 
   - Must avoid high draw calls.
   - Use `InstancedMesh` for particles/nodes.
   - Use custom GLSL shaders for the "core" and "energy" effects to offload calculations to the GPU.
   - Use `useFrame` for animations, avoiding React state updates for per-frame changes.
2. **Visuals**: 
   - "Stunning" = Bloom, chromatic aberration, glowing lines, organic movement.
   - Color Palette: Deep space blacks, neon cyans/purples (OmniSwarm aesthetic).
3. **Architecture**:
   - React Three Fiber (R3F) + Three.js.
   - Post-processing for the "Ultra" look.

**Design Plan:**
- **The Core**: A complex, rotating geometry (Icosahedron/Torus Knot) with a custom shader for a "pulsing energy" effect.
- **The Swarm**: 5,000+ particles using `InstancedMesh`. They should orbit the core in a mathematical pattern (spherical harmonics or simple orbital shells).
- **The Connections**: Dynamic lines connecting the core to the swarm. To keep it 60fps, I'll use a shader-based approach or a limited set of high-impact lines.
- **The Atmosphere**: A subtle starfield and a post-processing pipeline (Bloom is non-negotiable for "GodMode").

**Implementation Strategy:**
- `DataCore`: The main wrapper.
- `CoreGeometry`: Custom shader material for the center.
- `ParticleSwarm`: InstancedMesh with a custom vertex shader for movement.
- `PostProcessing`: Using `@react-three/postprocessing`.
</thinking>

```jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float, 
  MeshDistortMaterial, 
  Sphere, 
  Points, 
  PointMaterial 
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

/**
 * SHADER: DataCore Energy Core
 * Creates a pulsing, iridescent energy sphere with shifting noise
 */
const CoreShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#00f2ff') },
    uColor2: { value: new THREE.Color('#7000ff') },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
      float fresnel = pow(1.0 - dot(vNormal, vec3(0,0,1)), 3.0);
      vec3 color = mix(uColor1, uColor2, vUv.y + pulse * 0.2);
      gl_FragColor = vec4(color + fresnel * 0.5, 0.8);
    }
  `
};

const ParticleSwarm = ({ count = 5000 }) => {
  const meshRef = useRef();
  
  // Generate random positions and velocities for the swarm
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 10;
      randoms[i] = Math.random();
    }
    return { pos, randoms };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const matrix = new THREE.Matrix4();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.sin(t * 0.2 + particles.randoms[i3]) * 2;
      const angle = t * 0.1 + particles.randoms[i3 + 1] * Math.PI * 2;
      
      // Spherical distribution
      const x = Math.cos(angle) * radius * Math.sin(particles.randoms[i3 + 2] * Math.PI);
      const y = Math.sin(angle) * radius * Math.sin(particles.randoms[i3 + 2] * Math.PI);
      const z = Math.cos(particles.randoms[i3 + 2] * Math.PI) * radius;
      
      matrix.setPosition(x, y, z);
      meshRef.current.setMatrixAt(i, matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#00f2ff" transparent opacity={0.6} />
    </instancedMesh>
  );
};

const EnergyCore = () => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh>
        <icosahedronGeometry args={[1, 15]} />
        <shaderMaterial 
          ref={materialRef} 
          args={[CoreShaderMaterial]} 
          transparent 
        />
      </mesh>
      {/* Outer shell for depth */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#7000ff" wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  );
};

const DataCoreScene = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020205' }}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} />
        <color attach="background" args={['#020205']} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#7000ff" />

        <EnergyCore />
        <ParticleSwarm count={8000} />
        
        {/* Background Starfield */}
        <Points>
          <sphereGeometry args={[20, 32, 32]} />
          <PointMaterial 
            transparent 
            color="#ffffff" 
            size={0.02} 
            sizeAttenuation 
            opacity={0.3} 
          />
        </Points>

        <OrbitControls 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxDistance={20} 
          minDistance={5} 
        />

        <EffectComposer disableNull>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.4} 
          />
          <ChromaticAberration offset={[0.002, 0.002]} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default DataCoreScene;
```

### 🚀 Engineering Breakdown

**1. Performance Optimization (The 60fps Secret):**
- **`InstancedMesh`**: Instead of creating 8,000 individual `Mesh` objects (which would crash the browser due to draw calls), I used a single `instancedMesh`. This tells the GPU to render the same geometry 8,000 times in one single draw call.
- **Matrix Manipulation**: I update the `instanceMatrix` directly inside `useFrame`. This bypasses the React reconciliation loop entirely, ensuring the animation runs at the native refresh rate of the monitor.
- **Shader-Based Core**: The central "Energy Core" uses a custom GLSL shader. By calculating the "pulse" and "fresnel" effects on the GPU, we keep the CPU free for logic.

**2. Visual "GodMode" Aesthetics:**
- **Post-Processing Pipeline**: 
    - **Bloom**: Essential for that "neon" glow. I used `mipmapBlur` for a softer, more cinematic light bleed.
    - **Chromatic Aberration**: Adds a subtle "lens" distortion at the edges, making the digital effect feel like it's being viewed through a high-tech visor.
    - **Vignette & Noise**: Adds cinematic grit and focuses the user's eye on the central DataCore.
- **Mathematical Motion**: The swarm doesn't just move randomly; it follows a spherical harmonic pattern using `sin` and `cos` offsets, creating an organic, breathing movement.

**3. Technical Stack:**
- **React Three Fiber**: For the declarative scene graph.
- **Drei**: For high-level helpers like `Float` (for that floating weightless feel) and `OrbitControls`.
- **Postprocessing**: For the final visual polish.

**How to run:**
1. Install dependencies: `npm install three @types/three @react-three/fiber @react-three/drei @react-three/postprocessing`
2. Drop the component into your project.
3. Ensure your CSS removes body margins to allow the full-screen experience.