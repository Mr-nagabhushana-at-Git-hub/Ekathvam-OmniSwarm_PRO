<thinking>
The user wants a "GodMode V2 Ultra" UI component for "OmniSwarm". This isn't just a navbar; it's a high-fidelity HUD (Heads-Up Display) that serves as the primary navigation shell for a complex, high-performance application.

**Key Technical Requirements:**
1.  **Visuals**: "Extreme top-tier", "Insane micro-interactions", "Magnetic cursor effects".
2.  **Tech Stack**: 
    *   **React + TypeScript**: For the core structure.
    *   **Framer Motion**: For spring physics, layout animations, and gesture-based interactions.
    *   **ThreeJS (via React Three Fiber)**: To integrate a 3D "Core" or "Orb" that reacts to system state/cursor.
    *   **Tailwind CSS**: For rapid, precise styling and theme variables.
3.  **Features**:
    *   **Multi-theme**: Dynamic switching between Light, Dark, and "Cyber" (Accent) modes.
    *   **Magnetic Effects**: Elements that "pull" the cursor toward them.
    *   **HUD Elements**: System status, connectivity, and navigation for "20 Hyper-Pages".
    *   **Performance**: Sub-150ms response, optimized renders.

**Architectural Plan:**
1.  **The `OmniShell` Wrapper**: A provider-based wrapper to handle theme state and cursor tracking (global mouse coordinates for magnetic effects).
2.  **The `ThreeJSCore`**: A background/foreground 3D element (a morphing sphere or swarm) that represents the "OmniSwarm" intelligence.
3.  **The `MagneticNav`**: A navigation bar where items use `useMotionValue` and `useSpring` to create a magnetic attraction effect.
4.  **The `SystemHUD`**: Small, high-density data readouts (CPU, Latency, Agent Status) with glitch-style animations.
5.  **The `ThemeEngine`**: CSS variable-based system for instant theme swapping.

**Implementation Details:**
*   **Magnetic Logic**: Calculate distance between cursor and element center. Apply a translation offset based on a spring to create a "snapping" feel.
*   **ThreeJS Integration**: Use a `Canvas` with a `MeshDistortMaterial` to create an organic, pulsing core.
*   **Animations**: Use `AnimatePresence` for page transitions and `layoutId` for shared element transitions.
</thinking>

This is a hyper-engineered implementation of the **OmniSwarm GodMode V2 Ultra Shell**. It combines a React-based HUD, Framer Motion for physics-based interactions, and ThreeJS for a living, breathing system core.

### 🛠️ Technical Stack
- **Framework**: React 18 + TypeScript
- **Animation**: Framer Motion (Spring Physics)
- **3D Engine**: React Three Fiber + ThreeJS
- **Styling**: Tailwind CSS (Custom Design Tokens)
- **State**: React Context + Motion Values

```tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useMotionValueEvent 
} from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { 
  LayoutGrid, 
  Cpu, 
  Zap, 
  Shield, 
  Settings, 
  Activity, 
  Globe, 
  Command 
} from 'lucide-react';

// --- Types & Constants ---
type Theme = 'dark' | 'light' | 'cyber';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dash', label: 'Nexus', icon: <LayoutGrid size={18} />, path: '/nexus' },
  { id: 'swarm', label: 'Swarm', icon: <Globe size={18} />, path: '/swarm' },
  { id: 'core', label: 'Core', icon: <Cpu size={18} />, path: '/core' },
  { id: 'sec', label: 'Shield', icon: <Shield size={18} />, path: '/security' },
  { id: 'perf', label: 'Pulse', icon: <Activity size={18} />, path: '/performance' },
  { id: 'set', label: 'Config', icon: <Settings size={18} />, path: '/settings' },
];

// --- 3D System Core Component ---
const SystemCore = ({ theme }: { theme: Theme }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const colorMap = {
    dark: '#3b82f6',
    light: '#60a5fa',
    cyber: '#f0abfc',
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          color={colorMap[theme]}
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.8}
          roughness={0.2}
          emissive={colorMap[theme]}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
};

// --- Magnetic Button Component ---
const MagneticItem = ({ item, active, onClick }: { item: NavItem, active: boolean, onClick: () => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for the "magnetic" pull
  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center and apply a multiplier for the "pull"
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
      onClick={onClick}
      style={{ x, y }}
      className="relative group cursor-pointer"
    >
      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300
          ${active 
            ? 'bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
            : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'}
        `}
      >
        <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`}>
          {item.icon}
        </span>
        <span className="text-sm font-medium tracking-wide">{item.label}</span>
      </motion.div>
      
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute -inset-1 bg-blue-500/20 blur-xl rounded-full -z-10"
        />
      )}
    </motion.div>
  );
};

// --- Main OmniShell Component ---
export const OmniShell = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeTab, setActiveTab] = useState('dash');
  const [systemStatus, setSystemStatus] = useState({ cpu: 12, ram: 42, latency: 14 });

  // Simulate live system telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus({
        cpu: Math.floor(Math.random() * 20) + 5,
        ram: Math.floor(Math.random() * 10) + 40,
        latency: Math.floor(Math.random() * 5) + 10,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      theme === 'dark' ? 'bg-[#0a0a0c] text-white' : 
      theme === 'light' ? 'bg-slate-100 text-slate-900' : 
      'bg-[#050505] text-fuchsia-100'
    }`}>
      
      {/* 3D Background Layer */}
      <div className="fixed inset-0 -z-10 opacity-40 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <SystemCore theme={theme} />
        </Canvas>
      </div>

      {/* Top HUD Bar */}
      <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-50 backdrop-blur-md border-b border-white/10">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="p-2 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.6)]"
            >
              <Command size={20} className="text-white" />
            </motion.div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0c] animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase italic">
            Omni<span className="text-blue-500">Swarm</span> <span className="text-[10px] align-top opacity-50">V2.0</span>
          </span>
        </div>

        {/* Magnetic Navigation */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10">
          {NAV_ITEMS.map((item) => (
            <MagneticItem 
              key={item.id} 
              item={item} 
              active={activeTab === item.id} 
              onClick={() => setActiveTab(item.id)} 
            />
          ))}
        </div>

        {/* System Telemetry HUD */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest opacity-60">
            <div className="flex items-center gap-2">
              <Cpu size={12} /> <span>CPU: {systemStatus.cpu}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={12} /> <span>RAM: {systemStatus.ram}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={12} /> <span>LAT: {systemStatus.latency}ms</span>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/10">
            {(['dark', 'light', 'cyber'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-6 h-6 rounded-md transition-all ${
                  theme === t ? 'scale-125 ring-2 ring-blue-500' : 'opacity-40 hover:opacity-100'
                } ${
                  t === 'dark' ? 'bg-slate-800' : 
                  t === 'light' ? 'bg-slate-200' : 
                  'bg-fuchsia-600'
                }`}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-32 px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Dynamic Page Content Placeholder */}
            <div className="md:col-span-2 h-[60vh] rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="text-xs font-mono">SYSTEM_LOG: ACTIVE</div>
              </div>
              <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">
                {NAV_ITEMS.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-slate-400 max-w-md leading-relaxed">
                Hyper-engineered interface for the OmniSwarm ecosystem. 
                Integrating Rust-powered backends with a ThreeJS visual core.
              </p>
              
              {/* Decorative Grid */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 hover:border-blue-500/50 transition-colors group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                    <Zap size={20} />
                  </div>
                  <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                  <div className="h-2 w-16 bg-white/10 rounded-full" />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global CSS for Theme Variables */}
      <style jsx global>{`
        :root {
          --accent: #3b82f6;
          --accent-glow: rgba(59, 130, 246, 0.5);
        }
        .bg-accent { background-color: var(--accent); }
        body { overflow-x: hidden; }
      `}</style>
    </div>
  );
};
```

### 🚀 Hyper-Engineering Breakdown

1.  **The Magnetic Interaction**: 
    *   I used `useMotionValue` and `useSpring` to decouple the mouse movement from the render cycle. 
    *   The `MagneticItem` calculates the distance from the center of the element and applies a translation offset. This creates a "physical" feeling where the button is attracted to the cursor.

2.  **ThreeJS Integration**:
    *   The `SystemCore` uses a `MeshDistortMaterial` from `@react-three/drei`. This creates a morphing, organic sphere that serves as the visual heartbeat of the OS.
    *   The core is wrapped in a `Float` component to provide a weightless, floating animation.

3.  **Performance Optimization**:
    *   **GPU Acceleration**: All animations are handled via Framer Motion's `transform` properties, ensuring 60fps by avoiding layout reflows.
    *   **Z-Index Layering**: The 3D canvas is placed in a fixed `-z-10` layer, allowing the DOM HUD to sit on top without interfering with the WebGL render loop.

4.  **Theme Architecture**:
    *   The theme is managed via a top-level state that propagates to both the CSS classes (Tailwind) and the ThreeJS material colors, ensuring a unified visual experience across 2D and 3D spaces.

5.  **UX Micro-interactions**:
    *   **Layout Animations**: Using `layoutId="nav-glow"` allows the blue glow behind the active nav item to "slide" smoothly between items rather than disappearing and reappearing.
    *   **Telemetry HUD**: The top-right status indicators simulate real-time system data, adding to the "GodMode" OS aesthetic.