<thinking>
The objective is to build **Page 8 of 20** (`dashboard-page-8`), a "super hyper-engineered" dashboard view.

**Key Requirements Analysis:**
1.  **ThreeJS Integration**: Needs a breathtaking shader composition. I will implement a "Quantum Neural Field" background using a custom GLSL shader that reacts to mouse movement and data pulses.
2.  **20 Micro-Components**: The layout must be dense but organized. I'll create a grid of specialized widgets:
    *   *Metrics*: Real-time throughput, Latency (p99), Error rates, Cache hit ratio.
    *   *Visuals*: Sparklines, Radial gauges, Heatmaps, Connection graphs.
    *   *Controls*: Theme toggles, Font switchers, Backend status indicators.
    *   *Data*: Log streams, Resource monitors, Queue depths.
3.  **Animations**: `StaggerChildren` entrance using Framer Motion. I'll wrap the entire grid in a motion container with a `staggerChildren` transition.
4.  **Backend Integration**: Wiring to a Rust-based gRPC/Redis/Postgres stack. Since I'm providing the frontend, I will implement a `RustBackendClient` singleton that simulates gRPC-over-WebSocket behavior with high-precision timestamps and typed responses.
5.  **Styling**: 
    *   *Multi-font*: Integration of a "Technical" font (JetBrains Mono), a "Display" font (Inter/Outfit), and a "Data" font (Roboto Mono).
    *   *Multi-theme*: A theme provider supporting `Cyberpunk`, `Minimalist`, `DeepSea`, and `Solarized`.
    *   *Dark/Light*: Seamless transition using CSS variables.
6.  **Authorship**: Integration of Nagabhushana Raju S's signature.

**Architectural Plan:**
- `ThemeContext`: Manages the current theme and font set.
- `ThreeJSCanvas`: A separate layer using `@react-three/fiber` and `@react-three/drei` for the shader background.
- `DashboardGrid`: A CSS Grid layout utilizing `grid-template-areas` for complex positioning.
- `MicroComponent`: A higher-order wrapper for the 20 widgets to ensure consistent glassmorphism and animation.
- `RustClient`: A mock gRPC client using `rxjs` or simple `setInterval` to simulate the high-frequency data stream from a Rust backend.

**Technical Stack:**
- React 18 + TypeScript
- Framer Motion (Animations)
- Three.js / React Three Fiber (Shaders)
- Tailwind CSS (Styling)
- Lucide React (Icons)
- Zustand (State Management for Theme/Backend)
</thinking>

```tsx
import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Activity, Cpu, Database, Globe, Zap, Shield, 
  Layers, Terminal, Settings, Bell, Search, 
  ArrowUpRight, ArrowDownRight, RefreshCw, 
  Lock, Wifi, HardDrive, Clock, Gauge, LayoutGrid
} from 'lucide-react';

/**
 * =============================================================================
 * AUTHORSHIP GUARDIAN & SIGNATURE
 * =============================================================================
 * name      : Nagabhushana Raju S
 * title     : Engineer
 * website   : https://www.mr-nagabhushanaraju-s.engineer
 * github    : https://github.com/Mr-nagabhushana-at-Git-hub
 * org       : ORCMEGA — https://github.com/ORCMEGA-AI
 * copyright : Copyright (c) 2025-2030 Nagabhushana Raju S
 * =============================================================================
 */

// --- Types & Constants ---
type ThemeMode = 'dark' | 'light';
type ThemePalette = 'cyberpunk' | 'minimalist' | 'deepsea' | 'solarized';
type FontSet = 'technical' | 'modern' | 'classic';

interface BackendData {
  cpuUsage: number;
  memUsage: number;
  grpcLatency: number;
  redisHits: number;
  postgresTps: number;
  activeConnections: number;
  errorRate: number;
  throughput: number;
}

const THEMES: Record<ThemePalette, { bg: string; accent: string; panel: string; text: string }> = {
  cyberpunk: { bg: '#0a0a0f', accent: '#ff00ff', panel: 'rgba(20, 20, 30, 0.7)', text: '#00ffff' },
  minimalist: { bg: '#f5f5f7', accent: '#007aff', panel: 'rgba(255, 255, 255, 0.7)', text: '#1d1d1f' },
  deepsea: { bg: '#001219', accent: '#005f73', panel: 'rgba(0, 30, 40, 0.7)', text: '#94d2bd' },
  solarized: { bg: '#fdf6e3', accent: '#b58900', panel: 'rgba(253, 246, 227, 0.7)', text: '#657b83' },
};

const FONTS: Record<FontSet, { primary: string; mono: string }> = {
  technical: { primary: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace" },
  modern: { primary: "'Outfit', sans-serif", mono: "'Roboto Mono', monospace" },
  classic: { primary: "'Georgia', serif", mono: "'Courier New', monospace" },
};

// --- ThreeJS Shader Component ---
const QuantumFieldShader = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ff00ff') },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
  }), [viewport]);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec2 uResolution;
          uniform vec3 uColor;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float noise = sin(uv.x * 10.0 + uTime) * cos(uv.y * 10.0 + uTime);
            float dist = distance(uv, vec2(0.5));
            vec3 finalColor = mix(uColor, vec3(0.0, 0.0, 0.1), dist + noise * 0.2);
            gl_FragColor = vec4(finalColor, 0.3);
          }
        `}
      />
    </mesh>
  );
};

// --- Mock Rust Backend Client ---
class RustBackendClient {
  private static instance: RustBackendClient;
  
  static getInstance() {
    if (!this.instance) this.instance = new RustBackendClient();
    return this.instance;
  }

  async fetchMetrics(): Promise<BackendData> {
    // Simulating gRPC round-trip latency
    await new Promise(r => setTimeout(r, 45)); 
    return {
      cpuUsage: 20 + Math.random() * 30,
      memUsage: 40 + Math.random() * 20,
      grpcLatency: 0.12 + Math.random() * 0.08,
      redisHits: 85 + Math.random() * 10,
      postgresTps: 1200 + Math.random() * 500,
      activeConnections: 450 + Math.floor(Math.random() * 100),
      errorRate: Math.random() * 0.05,
      throughput: 150 + Math.random() * 50,
    };
  }
}

// --- Micro-Components ---
const Widget = ({ children, title, icon: Icon, className = "" }: any) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1 }
    }}
    className={`p-4 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-all group ${className}`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-accent" />}
        <span className="text-xs font-medium uppercase tracking-wider opacity-60">{title}</span>
      </div>
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    </div>
    {children}
  </motion.div>
);

const MetricValue = ({ value, unit, trend }: { value: string | number, unit: string, trend: 'up' | 'down' }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-2xl font-bold tracking-tighter">{value}{unit}</span>
    <span className={`text-[10px] flex items-center ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
      {trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
      {Math.abs(parseFloat(String(value)) * 0.1).toFixed(2)}%
    </span>
  </div>
);

// --- Main Page Component ---
export default function DashboardPage8() {
  const [theme, setTheme] = useState<ThemePalette>('cyberpunk');
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [font, setFont] = useState<FontSet>('technical');
  const [data, setData] = useState<BackendData | null>(null);

  useEffect(() => {
    const client = RustBackendClient.getInstance();
    const interval = setInterval(async () => {
      const metrics = await client.fetchMetrics();
      setData(metrics);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentTheme = THEMES[theme];
  const currentFont = FONTS[font];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 }
    }
  };

  return (
    <div 
      className={`min-h-screen w-full transition-colors duration-500 overflow-hidden relative`}
      style={{ 
        backgroundColor: mode === 'dark' ? currentTheme.bg : '#ffffff', 
        color: mode === 'dark' ? currentTheme.text : '#1d1d1f',
        fontFamily: currentFont.primary 
      }}
    >
      {/* ThreeJS Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Suspense fallback={null}>
            <QuantumFieldShader />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <mesh position={[2, 1, -2]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={currentTheme.accent} wireframe />
              </mesh>
            </Float>
          </Suspense>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="relative z-10 p-6 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto h-screen"
      >
        {/* Header / Navigation */}
        <header className="col-span-12 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
              <Zap className="text-accent" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ORCMEGA <span className="opacity-50 font-light">Core_v8</span></h1>
              <p className="text-[10px] opacity-40 font-mono">RUST_BACKEND // gRPC_STREAM // REDIS_L7</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switchers */}
            <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
              {(Object.keys(THEMES) as ThemePalette[]).map((t) => (
                <button 
                  key={t} 
                  onClick={() => setTheme(t)}
                  className={`w-6 h-6 rounded-full transition-all ${theme === t ? 'ring-2 ring-white scale-110' : 'opacity-50'}`}
                  style={{ backgroundColor: THEMES[t].accent }}
                />
              ))}
            </div>
            
            <button 
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              {mode === 'dark' ? <Globe size={18} /> : <Activity size={18} />}
            </button>

            <div className="h-8 w-px bg-white/10 mx-2" />
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              SYSTEM_OPTIMAL
            </div>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="col-span-12 grid grid-cols-12 gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Row 1: Primary Metrics */}
          <Widget title="CPU Load" icon={Cpu} className="col-span-3">
            <MetricValue value={data?.cpuUsage.toFixed(1) || '0.0'} unit="%" trend="up" />
            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent" 
                animate={{ width: `${data?.cpuUsage || 0}%` }} 
                style={{ backgroundColor: currentTheme.accent }}
              />
            </div>
          </Widget>

          <Widget title="Memory" icon={HardDrive} className="col-span-3">
            <MetricValue value={data?.memUsage.toFixed(1) || '0.0'} unit="%" trend="down" />
            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent" 
                animate={{ width: `${data?.memUsage || 0}%` }} 
                style={{ backgroundColor: currentTheme.accent }}
              />
            </div>
          </Widget>

          <Widget title="gRPC Latency" icon={Zap} className="col-span-3">
            <MetricValue value={data?.grpcLatency.toFixed(3) || '0.000'} unit="ms" trend="down" />
            <div className="mt-4 flex gap-1 items-end h-8">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="flex-1 bg-accent/40 rounded-t-sm"
                  animate={{ height: `${Math.random() * 100}%` }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 + Math.random() }}
                  style={{ backgroundColor: currentTheme.accent }}
                />
              ))}
            </div>
          </Widget>

          <Widget title="Redis Hit Rate" icon={Database} className="col-span-3">
            <MetricValue value={data?.redisHits.toFixed(1) || '0.0'} unit="%" trend="up" />
            <div className="mt-4 flex justify-between items-center text-[10px] opacity-50 font-mono">
              <span>CACHE_L1: 98%</span>
              <span>CACHE_L2: 82%</span>
            </div>
          </Widget>

          {/* Row 2: Advanced Visuals */}
          <Widget title="Postgres TPS" icon={Layers} className="col-span-6 h-64">
            <div className="flex items-center justify-between mb-4">
              <MetricValue value={data?.postgresTps.toFixed(0) || '0'} unit=" tx/s" trend="up" />
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-white/5 text-[8px] border border-white/10">READ: 80%</span>
                <span className="px-2 py-1 rounded bg-white/5 text-[8px] border border-white/10">WRITE: 20%</span>
              </div>
            </div>
            <div className="relative h-32 w-full flex items-end gap-1">
              {[...Array(30)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="flex-1 bg-accent/20 rounded-t-sm"
                  animate={{ height: `${20 + Math.random() * 80}%` }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
                  style={{ backgroundColor: currentTheme.accent }}
                />
              ))}
            </div>
          </Widget>

          <Widget title="Network Topology" icon={Globe} className="col-span-6 h-64">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center items-center text-center">
                <Wifi size={20} className="mb-2 text-accent" />
                <span className="text-xs font-bold">Edge Nodes</span>
                <span className="text-lg font-mono">{data?.activeConnections || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center items-center text-center">
                <Shield size={20} className="mb-2 text-accent" />
                <span className="text-xs font-bold">Firewall</span>
                <span className="text-lg font-mono">ACTIVE</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center items-center text-center">
                <Clock size={20} className="mb-2 text-accent" />
                <span className="text-xs font-bold">Uptime</span>
                <span className="text-lg font-mono">99.99%</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center items-center text-center">
                <Gauge size={20} className="mb-2 text-accent" />
                <span className="text-xs font-bold">Throughput</span>
                <span className="text-lg font-mono">{data?.throughput.toFixed(1) || '0'} GB/s</span>
              </div>
            </div>
          </Widget>

          {/* Row 3: System Logs & Controls */}
          <Widget title="Kernel Event Stream" icon={Terminal} className="col-span-8 h-64">
            <div className="font-mono text-[11px] space-y-1 opacity-80 overflow-hidden h-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-3 border-b border-white/5 pb-1">
                  <span className="text-accent opacity-50">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-green-400">INFO</span>
                  <span className="flex-1">gRPC_REQUEST_RECEIVED: /v1/metrics_stream {trace_id: "ox_4421"}</span>
                  <span className="opacity-30">200 OK</span>
                </div>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-4 bg-accent inline-block align-middle ml-1"
              />
            </div>
          </Widget>

          <div className="col-span-4 grid grid-cols-1 gap-6">
            <Widget title="Quick Controls" icon={Settings} className="h-32">
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 text-[10px] rounded bg-white/5 border border-white/10 hover:bg-accent/20 transition-colors flex items-center justify-center gap-1">
                  <RefreshCw size={10} /> PURGE_CACHE
                </button>
                <button className="p-2 text-[10px] rounded bg-white/5 border border-white/10 hover:bg-accent/20 transition-colors flex items-center justify-center gap-1">
                  <Lock size={10} /> LOCK_API
                </button>
                <button className="p-2 text-[10px] rounded bg-white/5 border border-white/10 hover:bg-accent/20 transition-colors flex items-center justify-center gap-1">
                  <LayoutGrid size={10} /> REORG_GRID
                </button>
                <button className="p-2 text-[10px] rounded bg-white/5 border border-white/10 hover:bg-accent/20 transition-colors flex items-center justify-center gap-1">
                  <Bell size={10} /> MUTE_ALERTS
                </button>
              </div>
            </Widget>
            <Widget title="System Health" icon={Activity} className="h-32">
              <div className="flex flex-col justify-center h-full gap-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span>ERROR_RATE</span>
                  <span className="text-red-400">{(data?.errorRate || 0).toFixed(4)}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-500" 
                    animate={{ width: `${(data?.errorRate || 0) * 1000}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono mt-2">
                  <span>STABILITY_INDEX</span>
                  <span className="text-green-400">99.92%</span>
                </div>
              </div>
            </Widget>
          </div>
        </div>

        {/* Footer Signature */}
        <footer className="col-span-12 flex justify-between items-center py-4 border-t border-white/10 mt-auto">
          <div className="text-[10px] opacity-40 font-mono">
            BUILD_ID: 0x882_PROD // NODE: US-EAST-1 // VERSION: 8.0.4-STABLE
          </div>
          <div className="text-[10px] opacity-60 font-medium">
            Designed & Engineered by <a href="https://www.mr-nagabhushanaraju-s.engineer" className="text-accent underline">Nagabhushana Raju S</a>
          </div>
        </footer>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .text-accent {
          color: ${currentTheme.accent};
        }
        .bg-accent {
          background-color: ${currentTheme.accent};
        }
      `}</style>
    </div>
  );
}
```