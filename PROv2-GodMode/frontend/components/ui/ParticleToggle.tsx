<thinking>
The objective is to build a "GodMode V2 Ultra" `ParticleToggle` component. This isn't just a switch; it's a high-fidelity UI piece for "OmniSwarm," requiring a blend of 2D (Framer Motion) and 3D (ThreeJS) elements, magnetic cursor interactions, and a sophisticated theme system.

**1. Architectural Breakdown:**
*   **The Core Toggle**: A high-performance React component using `framer-motion` for the physical transition.
*   **The Particle System**: A ThreeJS canvas overlay that reacts to the toggle state. When "Off," particles are dormant/ordered; when "On," they enter a "Swarm" state (chaotic, high-energy).
*   **Magnetic Interaction**: A custom hook to calculate the distance between the cursor and the toggle, applying a spring-based offset to the component to make it feel "magnetic."
*   **Theme Engine**: CSS Variables integrated with Tailwind, supporting dynamic switching between Light, Dark, and "GodMode" (Neon/Cyber) themes.
*   **Performance**: Use `memo`, `useCallback`, and `requestAnimationFrame` (via ThreeJS) to ensure 60fps+ even with hundreds of particles.

**2. Technical Implementation Strategy:**
*   **Framer Motion**: Use `layoutId` for smooth transitions and `spring` physics for the "snap" feel.
*   **ThreeJS**: Implement a `Points` material with a custom shader or a simple vertex manipulation loop to create the "swarm" effect.
*   **Cursor Logic**: Track mouse coordinates globally and map them to a local coordinate system for the magnetic pull.
*   **Accessibility**: Ensure `role="switch"`, `aria-checked`, and keyboard support (`Enter`/`Space`).

**3. Visual Language:**
*   **Off State**: Minimalist, muted colors, static particles, "Cold" feel.
*   **On State**: Glowing accents, vibrant particles, erratic movement, "Hyper-drive" feel.
*   **Transitions**: Not a linear slide, but a "pop" with an elastic overshoot.

**4. Refinement (The "Ultra" part):**
*   Add a "Glow" layer using SVG filters or CSS `drop-shadow`.
*   Implement a "Haptic" visual feedback (slight shake on toggle).
*   Ensure the ThreeJS canvas is transparent and perfectly aligned behind the toggle.
</thinking>

```tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

/**
 * OMNISWARM GODMODE V2 ULTRA - ParticleToggle
 * 
 * Features:
 * 1. Magnetic Cursor Interaction (Spring-based)
 * 2. ThreeJS Particle Swarm (State-reactive)
 * 3. Hyper-animated Micro-interactions (Framer Motion)
 * 4. Multi-theme Dynamic Adaptation
 */

// --- Types & Constants ---
type ThemeMode = 'light' | 'dark' | 'godmode';

interface ParticleToggleProps {
  initialState?: boolean;
  onToggle?: (state: boolean) => void;
  theme?: ThemeMode;
}

const SPRING_CONFIG = { stiffness: 300, damping: 30 };
const MAGNETIC_STRENGTH = 0.2;

// --- ThreeJS Particle System Component ---
const SwarmBackground = ({ active }: { active: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 1000;
  
  // Initialize particles
  const particles = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      if (active) {
        // Swarm Mode: Chaotic, orbiting movement
        positions[i3] += Math.sin(time + y) * 0.02;
        positions[i3 + 1] += Math.cos(time + x) * 0.02;
        positions[i3 + 2] += Math.sin(time * 0.5) * 0.01;
      } else {
        // Dormant Mode: Slow drift towards origin
        positions[i3] *= 0.99;
        positions[i3 + 1] *= 0.99;
        positions[i3 + 2] *= 0.99;
        // Add slight noise to prevent total collapse
        positions[i3] += (Math.random() - 0.5) * 0.01;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particleCount} 
          array={particles} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.015} 
        color={active ? "#00f2ff" : "#666"} 
        transparent 
        opacity={active ? 0.8 : 0.3} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// --- Main Component ---
export const ParticleToggle: React.FC<ParticleToggleProps> = ({ 
  initialState = false, 
  onToggle, 
  theme = 'dark' 
}) => {
  const [isOn, setIsOn] = useState(initialState);
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetic Cursor Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center and apply magnetic pull
    const deltaX = (e.clientX - centerX) * MAGNETIC_STRENGTH;
    const deltaY = (e.clientY - centerY) * MAGNETIC_STRENGTH;
    
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const toggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle?.(newState);
  };

  // Theme-based styling
  const themeStyles = {
    light: {
      bg: 'bg-slate-100',
      track: 'bg-slate-300',
      accent: 'bg-blue-500',
      text: 'text-slate-900',
      glow: 'shadow-blue-400/50'
    },
    dark: {
      bg: 'bg-slate-900',
      track: 'bg-slate-700',
      accent: 'bg-indigo-500',
      text: 'text-slate-100',
      glow: 'shadow-indigo-500/50'
    },
    godmode: {
      bg: 'bg-black',
      track: 'bg-zinc-800',
      accent: 'bg-cyan-400',
      text: 'text-cyan-100',
      glow: 'shadow-cyan-400/80'
    }
  }[theme];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center p-20 rounded-3xl transition-colors duration-500 ${themeStyles.bg}`}
    >
      {/* ThreeJS Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 2] }}>
          <ambientLight intensity={0.5} />
          <SwarmBackground active={isOn} />
        </Canvas>
      </div>

      {/* Interactive Toggle */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="relative z-10"
      >
        <button
          onClick={toggle}
          role="switch"
          aria-checked={isOn}
          className={`
            relative w-24 h-12 rounded-full p-1 transition-all duration-300
            ${themeStyles.track} ${isOn ? 'ring-2 ring-offset-2 ring-offset-transparent ring-cyan-400' : ''}
            ${themeStyles.glow} shadow-lg
          `}
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`
              w-10 h-10 rounded-full shadow-xl cursor-pointer
              ${themeStyles.accent}
              ${isOn ? 'translate-x-12' : 'translate-x-0'}
            `}
            animate={{
              scale: isOn ? 1.1 : 1,
              boxShadow: isOn 
                ? `0 0 20px 5px ${themeStyles.accent === 'bg-cyan-400' ? '#22d3ee' : '#6366f1'}` 
                : '0 0 0px 0px transparent'
            }}
          />
        </button>
      </motion.div>

      {/* Status Label */}
      <div className="absolute bottom-4 flex flex-col items-center gap-1">
        <motion.span 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`text-xs font-mono uppercase tracking-widest ${themeStyles.text}`}
        >
          {isOn ? '⚡ GodMode Active' : '💤 System Dormant'}
        </motion.span>
      </div>
    </div>
  );
};

// --- Demo Wrapper ---
export default function OmniSwarmDemo() {
  const [theme, setTheme] = useState<ThemeMode>('godmode');

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-8 bg-zinc-950 p-4">
      <div className="flex gap-4 mb-8">
        {(['light', 'dark', 'godmode'] as ThemeMode[]).map((t) => (
          <button 
            key={t}
            onClick={() => setTheme(t)}
            className={`px-4 py-2 rounded-full text-xs uppercase font-bold transition-all ${
              theme === t ? 'bg-white text-black scale-110' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      
      <ParticleToggle theme={theme} />
      
      <div className="text-zinc-500 text-center max-w-md">
        <p className="text-sm font-mono">
          Hover the toggle to experience <span className="text-cyan-400">Magnetic Pull</span>. 
          Toggle to activate the <span className="text-cyan-400">ThreeJS Swarm Engine</span>.
        </p>
      </div>
    </div>
  );
}
```

### Engineering Breakdown:

1.  **The Magnetic Effect**: I implemented a `useMotionValue` combined with `useSpring`. Instead of a simple CSS transition, the component calculates the distance between the cursor and the center of the toggle. The `springX` and `springY` values create a "physical" pull that feels organic and high-end.
2.  **The Swarm Engine (ThreeJS)**: 
    *   **Dormant State**: Particles use a simple linear interpolation (LERP) to drift back toward the center $(0,0,0)$, creating a "collapsed" or "sleeping" effect.
    *   **Active State**: I implemented a trigonometric orbital function. Particles move based on their position in space (`Math.sin(time + y)`), creating a complex, swirling swarm that looks like a high-energy plasma field.
3.  **Micro-Interactions**:
    *   **Layout Animations**: Used Framer Motion's `layout` prop on the toggle knob. This ensures that the transition from left to right is handled by the layout engine, allowing for a smooth, spring-based slide.
    *   **Dynamic Glow**: The `boxShadow` is animated based on the `isOn` state, creating a "power-up" visual cue.
4.  **Performance Optimization**:
    *   **BufferGeometry**: Used `Float32Array` for particle positions to minimize garbage collection and maximize GPU throughput.
    *   **Memoization**: The particle array is wrapped in `useMemo` to prevent re-initialization on every React render cycle.
    *   **RequestAnimationFrame**: The ThreeJS `useFrame` hook ensures the animation loop is synced with the browser's refresh rate.
5.  **Theme Architecture**: The component uses a mapping object to inject theme-specific Tailwind classes and colors, ensuring that the "GodMode" aesthetic (Cyan/Black) is distinct from standard Light/Dark modes.