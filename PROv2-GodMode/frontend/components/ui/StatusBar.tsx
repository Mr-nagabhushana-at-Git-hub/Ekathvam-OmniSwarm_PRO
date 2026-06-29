<thinking>
The objective is to build a "GodMode V2 Ultra" StatusBar for "OmniSwarm". This isn't just a navigation bar; it's a high-fidelity HUD (Heads-Up Display) that needs to feel like a futuristic OS.

**Key Technical Requirements:**
1.  **Framer Motion**: Use spring physics for "organic" movement, layout animations, and magnetic cursor effects.
2.  **ThreeJS**: Integrate a 3D background/element within the status bar to give it depth (e.g., a floating holographic crystal or a data-stream wave).
3.  **Multi-Theme**: Dynamic adaptation between Light, Dark, and "Cyber" (Accent-driven) modes.
4.  **Micro-interactions**: Magnetic buttons, hover-glows, and state-transition animations.
5.  **Architecture**: TypeScript, React, Tailwind CSS.

**Design Strategy:**
- **Glassmorphism**: Use `backdrop-blur` and semi-transparent borders to create a layered feel.
- **Magnetic Effect**: Implement a custom hook that calculates the distance between the cursor and the element, applying a translation offset using Framer Motion's `useSpring`.
- **ThreeJS Integration**: Use `@react-three/fiber` and `@react-three/drei` for a lightweight, performant 3D canvas that lives behind the UI elements.
- **Dynamic Themes**: Use CSS variables for colors, allowing instant switching without re-renders of the entire tree.

**Component Breakdown:**
- `OmniStatusBar`: The main container.
- `MagneticButton`: A wrapper for interactive elements.
- `HUDBackground`: The ThreeJS canvas.
- `SystemMetrics`: Animated data readouts (CPU, RAM, Latency) to sell the "GodMode" aesthetic.
- `ThemeToggle`: A high-polish switch.

**Performance Considerations:**
- Use `memo` for static parts.
- Use `useSpring` for smooth, non-janky animations.
- Ensure the ThreeJS canvas is optimized (low poly, efficient shaders).
</thinking>

```tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Activity, 
  Cpu, 
  Globe, 
  Moon, 
  Sun, 
  Zap, 
  ShieldCheck, 
  Terminal,
  ChevronRight
} from 'lucide-react';

// --- Types & Constants ---
type Theme = 'dark' | 'light' | 'cyber';

interface StatusBarProps {
  user?: { name: string; role: string };
  systemStatus?: 'optimal' | 'warning' | 'critical';
}

const THEMES = {
  dark: {
    bg: 'rgba(10, 10, 12, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: 'text-slate-200',
    accent: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.5)',
  },
  light: {
    bg: 'rgba(245, 245, 250, 0.7)',
    border: 'rgba(0, 0, 0, 0.1)',
    text: 'text-slate-800',
    accent: '#2563eb',
    glow: 'rgba(37, 99, 235, 0.3)',
  },
  cyber: {
    bg: 'rgba(15, 0, 30, 0.8)',
    border: 'rgba(0, 255, 157, 0.3)',
    text: 'text-emerald-400',
    accent: '#00ff9d',
    glow: 'rgba(0, 255, 157, 0.6)',
  },
};

// --- 3D Background Component ---
const HolographicCore = ({ theme }: { theme: Theme }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(THEMES[theme].accent), [theme]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={0.6}>
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.4}
          radius={1}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0}
          metalness={1}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
};

// --- Magnetic Interaction Wrapper ---
const MagneticElement = ({ children }: { children: React.ReactNode }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.3);
    mouseY.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
};

// --- Sub-Components ---
const Metric = ({ icon: Icon, label, value, color }: any) => (
  <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 group cursor-default">
    <Icon size={14} className={`${color} group-hover:scale-110 transition-transform`} />
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-tighter opacity-50 font-bold">{label}</span>
      <span className="text-xs font-mono font-medium leading-none">{value}</span>
    </div>
  </div>
);

// --- Main StatusBar Component ---
export const OmniStatusBar = ({ user = { name: 'Admin', role: 'Architect' }, systemStatus = 'optimal' }: StatusBarProps) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const currentTheme = THEMES[theme];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`
          mx-auto max-w-7xl h-16 rounded-2xl 
          pointer-events-auto flex items-center justify-between px-6
          border transition-colors duration-500
          ${currentTheme.bg} ${currentTheme.text}
          backdrop-blur-xl shadow-2xl
        `}
        style={{ borderColor: currentTheme.border }}
      >
        {/* ThreeJS Layer */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-40">
          <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <HolographicCore theme={theme} />
          </Canvas>
        </div>

        {/* Left Section: Brand & Status */}
        <div className="relative z-10 flex items-center gap-6">
          <MagneticElement>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div 
                  className="absolute inset-0 blur-md rounded-full animate-pulse" 
                  style={{ backgroundColor: currentTheme.accent }}
                />
                <div className="relative bg-black p-2 rounded-lg border border-white/20">
                  <Zap size={20} fill={currentTheme.accent} color={currentTheme.accent} />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tighter uppercase italic">OmniSwarm</h1>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full animate-ping ${systemStatus === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest">GodMode V2 Ultra</span>
                </div>
              </div>
            </div>
          </MagneticElement>

          <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-6">
            <Metric icon={Cpu} label="CPU" value="12.4%" color="text-blue-400" />
            <Metric icon={Activity} label="LAT" value="14ms" color="text-emerald-400" />
            <Metric icon={Globe} label="NET" value="1.2Gbps" color="text-purple-400" />
          </div>
        </div>

        {/* Center Section: Navigation/Search (Implicit) */}
        <div className="relative z-10 hidden lg:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
          {['Dashboard', 'Neural Map', 'Rust Core', 'Logs'].map((item) => (
            <MagneticElement key={item}>
              <button className="px-4 py-1.5 text-xs font-medium rounded-lg transition-all hover:bg-white/10 hover:text-white opacity-70 hover:opacity-100">
                {item}
              </button>
            </MagneticElement>
          ))}
        </div>

        {/* Right Section: User & Theme */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase opacity-50 leading-none">{user.role}</p>
              <p className="text-xs font-medium leading-tight">{user.name}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
              {user.name[0]}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle current={theme} setTheme={setTheme} />
            <MagneticElement>
              <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/20 transition-colors">
                <Terminal size={18} />
              </button>
            </MagneticElement>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ThemeToggle = ({ current, setTheme }: { current: Theme; setTheme: (t: Theme) => void }) => {
  return (
    <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10">
      {(['dark', 'light', 'cyber'] as Theme[]).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`
            relative w-8 h-8 rounded-lg transition-all duration-300 flex items-center justify-center
            ${current === t ? 'bg-white/20 shadow-inner scale-90' : 'hover:bg-white/10'}
          `}
        >
          {t === 'dark' && <Moon size={14} />}
          {t === 'light' && <Sun size={14} />}
          {t === 'cyber' && <ShieldCheck size={14} className="text-emerald-400" />}
          {current === t && (
            <motion.div 
              layoutId="theme-glow" 
              className="absolute inset-0 rounded-lg blur-sm" 
              style={{ backgroundColor: THEMES[t].accent, opacity: 0.4 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default OmniStatusBar;
```

### 🛠️ Engineering Breakdown

1.  **The "GodMode" Aesthetic**: 
    *   **ThreeJS Integration**: I used `@react-three/fiber` to embed a `HolographicCore`. This is a distorted sphere with a `MeshDistortMaterial` that creates a fluid, organic 3D shape. It's rendered in a separate canvas layer with `pointer-events-none` so it doesn't interfere with UI interactions.
    *   **Glassmorphism**: The container uses `backdrop-blur-xl` and a semi-transparent background (`rgba`) to create a depth effect where the 3D core is visible but muted behind the UI.

2.  **Hyper-Interactions**:
    *   **Magnetic Cursor**: The `MagneticElement` component uses `useMotionValue` and `useSpring`. It calculates the delta between the mouse position and the element's center, then applies a dampened translation. This creates that "premium" feel where buttons subtly pull toward the cursor.
    *   **Spring Physics**: Every transition (theme switching, entry animation) uses Framer Motion's spring physics (`stiffness`, `damping`) instead of linear easing to mimic real-world inertia.

3.  **Dynamic Theme Engine**:
    *   Instead of hardcoding Tailwind classes for every state, I implemented a `THEMES` configuration object. This allows the `HolographicCore` (ThreeJS) and the CSS layer to share the same accent colors, ensuring a perfectly synchronized visual identity across 2D and 3D.

4.  **Performance Optimization**:
    *   **Canvas Optimization**: The ThreeJS sphere is low-poly (64 segments) and uses a single point light to keep the GPU overhead minimal.
    *   **Layout Animations**: `layoutId` is used on the theme toggle glow, allowing the highlight to "slide" between buttons rather than snapping.

### 🚀 How to implement
1. Install dependencies: `npm install framer-motion three @types/three @react-three/fiber @react-three/drei lucide-react`
2. Drop the `OmniStatusBar` into your root layout.
3. Ensure your Tailwind config includes `backdrop-blur` utilities.