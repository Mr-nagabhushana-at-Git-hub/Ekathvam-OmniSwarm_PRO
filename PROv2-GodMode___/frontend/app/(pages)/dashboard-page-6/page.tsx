<thinking>
The user wants "Page 6 of 20" of a "Super Hyper-Engineered UI".
Key requirements:
1.  **View**: `dashboard-page-6`.
2.  **Visuals**: ThreeJS shaders, 20 micro-components, "breathtaking composition".
3.  **Animations**: `StaggerChildren` for entrance (Framer Motion).
4.  **Backend**: Integration with a "hyper-engineered Rust backend" (gRPC/Redis/Postgres).
5.  **Features**: Multi-font typography, multi-theme switching, seamless dark/light modes.
6.  **Engineering Level**: "SUPER ADVANCED".

**Architectural Strategy:**
- **Frontend**: React 18 + TypeScript + Tailwind CSS.
- **State Management**: Zustand for theme and global data.
- **3D Layer**: React Three Fiber (R3F) + Custom GLSL Shaders for a "Quantum Data Field" background.
- **Animation**: Framer Motion for the layout orchestration.
- **Typography**: Dynamic font loading (Inter, JetBrains Mono, Playfair Display) based on theme.
- **Backend Bridge**: A gRPC-web / WebSocket bridge to a Rust backend. Since I'm providing the frontend code, I will implement a `useRustBackend` hook that simulates the high-performance gRPC stream.

**Component Breakdown (The 20 Micro-Components):**
I will group these into 4 logical clusters (5 components each) to maintain a clean grid:
1.  **Neural Metrics**: Real-time throughput, Latency Heatmap, Memory Pressure, CPU Jitter, Queue Depth.
2.  **System Health**: Node Status, Redis Hit Rate, Postgres IOPS, gRPC Stream Health, Auth Latency.
3.  **Security Layer**: Threat Level, WAF Blocks, SSH Attempts, Key Rotation Status, Audit Log Stream.
4.  **Quantum State**: Entropy Level, Packet Loss, Jitter Buffer, Sync Offset, Clock Drift.

**Shader Concept**: A "Hyper-Grid" shader using Simplex noise and vertex displacement to create a living, breathing data surface that reacts to the theme.

**Theme Engine**: A CSS-variable based system mapped to a Zustand store, allowing "Cyberpunk", "Minimalist", "Deep Sea", and "Light" modes.
</thinking>

```tsx
/**
 * @file DashboardPage6.tsx
 * @description Page 6: The Quantum System Orchestrator
 * @author Nagabhushana Raju S
 * @version 2.0.0
 * @license Copyright (c) 2025-2030 Nagabhushana Raju S
 */

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { 
  Activity, Shield, Cpu, Zap, Database, 
  Globe, Lock, RefreshCw, AlertTriangle, Terminal 
} from 'lucide-react';

// =============================================================================
// 1. HYPER-ENGINEERED STATE MANAGEMENT (Zustand)
// =============================================================================

interface ThemeConfig {
  name: string;
  colors: {
    bg: string;
    panel: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
    glow: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
}

const THEMES: Record<string, ThemeConfig> = {
  cyberpunk: {
    name: 'Cyberpunk',
    colors: {
      bg: '#050505',
      panel: 'rgba(20, 20, 25, 0.7)',
      accent: '#00ffcc',
      text: '#e0e0e0',
      textMuted: '#888',
      border: 'rgba(0, 255, 204, 0.3)',
      glow: '0 0 20px rgba(0, 255, 204, 0.4)',
    },
    fonts: { heading: 'Orbitron', body: 'Inter', mono: 'JetBrains Mono' },
  },
  deepsea: {
    name: 'Deep Sea',
    colors: {
      bg: '#000b1a',
      panel: 'rgba(0, 20, 40, 0.7)',
      accent: '#3a86ff',
      text: '#d1d1e0',
      textMuted: '#607080',
      border: 'rgba(58, 134, 255, 0.3)',
      glow: '0 0 20px rgba(58, 134, 255, 0.4)',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter', mono: 'Fira Code' },
  },
  light: {
    name: 'Light Mode',
    colors: {
      bg: '#f5f7fa',
      panel: 'rgba(255, 255, 255, 0.8)',
      accent: '#4f46e5',
      text: '#1f2937',
      textMuted: '#6b7280',
      border: 'rgba(79, 70, 229, 0.2)',
      glow: '0 0 10px rgba(79, 70, 229, 0.2)',
    },
    fonts: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
  },
};

interface AppState {
  theme: string;
  setTheme: (theme: string) => void;
  data: any;
  setData: (data: any) => void;
}

const useStore = create<AppState>((set) => ({
  theme: 'cyberpunk',
  setTheme: (theme) => set({ theme }),
  data: null,
  setData: (data) => set({ data }),
}));

// =============================================================================
// 2. ADVANCED THREEJS SHADERS (GLSL)
// =============================================================================

const QuantumFieldShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00ffcc') },
    uIntensity: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying float vZ;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      // Create a wave-like displacement
      float noise = sin(pos.x * 2.0 + uTime) * cos(pos.y * 2.0 + uTime) * 0.5;
      pos.z += noise;
      vZ = noise;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vZ;
    uniform vec3 uColor;
    uniform float uTime;

    void main() {
      float grid = sin(vUv.x * 50.0) * sin(vUv.y * 50.0);
      float alpha = smoothstep(0.0, 0.1, grid) * 0.3;
      vec3 finalColor = mix(uColor * 0.2, uColor, vZ + 0.5);
      gl_FragColor = vec4(finalColor, alpha + 0.1);
    }
  `,
};

const BackgroundScene = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useStore();
  const currentTheme = THEMES[theme];
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uColor.value.set(currentTheme.colors.accent);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} scale={10}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <shaderMaterial 
          fragmentShader={QuantumFieldShader.fragmentShader} 
          vertexShader={QuantumFieldShader.vertexShader} 
          uniforms={QuantumFieldShader.uniforms}
          transparent
        />
      </mesh>
    </Float>
  );
};

// =============================================================================
// 3. MICRO-COMPONENTS (The 20-Component Grid)
// =============================================================================

const MetricCard = ({ title, value, unit, icon: Icon, trend }: any) => {
  const { theme } = useStore();
  const colors = THEMES[theme].colors;

  return (
    <motion.div 
      variants={cardVariants}
      className="p-4 rounded-xl border backdrop-blur-md transition-all duration-500"
      style={{ 
        backgroundColor: colors.panel, 
        borderColor: colors.border, 
        color: colors.text,
        boxShadow: colors.glow 
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.accent}22` }}>
          <Icon size={16} style={{ color: colors.accent }} />
        </div>
        <span className={`text-xs font-mono ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      </div>
      <div className="text-xs opacity-60 uppercase tracking-wider mb-1">{title}</div>
      <div className="text-2xl font-bold font-mono">
        {value}<span className="text-sm ml-1 opacity-50">{unit}</span>
      </div>
    </motion.div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
  })
};

// =============================================================================
// 4. MAIN PAGE COMPOSITION
// =============================================================================

export default function DashboardPage6() {
  const { theme, setTheme } = useStore();
  const currentTheme = THEMES[theme];

  // Mocking the Rust Backend gRPC Stream
  const [metrics, setMetrics] = useState<any>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        neural: { throughput: (Math.random() * 100 + 400).toFixed(2), latency: (Math.random() * 5 + 2).toFixed(2), mem: (Math.random() * 20 + 60).toFixed(1), jitter: (Math.random() * 0.5).toFixed(3), queue: Math.floor(Math.random() * 100) },
        health: { nodes: '12/12', redis: (Math.random() * 10 + 90).toFixed(1), iops: (Math.random() * 1000 + 5000).toFixed(0), grpc: 'Healthy', auth: '12ms' },
        security: { threat: 'Low', waf: Math.floor(Math.random() * 1000), ssh: Math.floor(Math.random() * 50), rotation: 'Active', audit: 'Streaming' },
        quantum: { entropy: (Math.random() * 1).toFixed(4), loss: '0.001%', jitterB: '4ms', sync: '0.2ns', drift: '0.01ms' },
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="min-h-screen w-full transition-colors duration-700 overflow-hidden relative"
      style={{ 
        backgroundColor: currentTheme.colors.bg, 
        color: currentTheme.colors.text,
        fontFamily: currentTheme.fonts.body 
      }}
    >
      {/* Dynamic Font Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700&family=Playfair+Display:wght@700&display=swap');
        .font-heading { font-family: ${currentTheme.fonts.heading}, sans-serif; }
        .font-mono { font-family: ${currentTheme.fonts.mono}, monospace; }
      `}</style>

      {/* ThreeJS Background Layer */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <BackgroundScene />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-8 max-w-[1600px] mx-auto h-screen flex flex-col">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center" style={{ borderColor: currentTheme.colors.accent }}>
              <Zap size={24} style={{ color: currentTheme.colors.accent }} />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold tracking-tighter">QUANTUM_ORCHESTRATOR</h1>
              <p className="text-xs opacity-50 font-mono">RUST_BACKEND // gRPC_STREAM // v6.0.4</p>
            </div>
          </motion.div>

          <div className="flex gap-3">
            {Object.keys(THEMES).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all border ${theme === t ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
                style={{ 
                  backgroundColor: theme === t ? currentTheme.colors.accent : 'transparent',
                  color: theme === t ? currentTheme.colors.bg : currentTheme.colors.text,
                  borderColor: currentTheme.colors.border
                }}
              >
                {THEMES[t].name}
              </button>
            ))}
          </div>
        </header>

        {/* Main Grid Composition */}
        <motion.div 
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1"
        >
          {/* Cluster 1: Neural Metrics */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <Activity size={16} /> <span className="text-xs font-mono uppercase tracking-widest">Neural Metrics</span>
            </div>
            <MetricCard title="Throughput" value={metrics?.neural?.throughput} unit="req/s" icon={Zap} trend={2.4} />
            <MetricCard title="Avg Latency" value={metrics?.neural?.latency} unit="ms" icon={RefreshCw} trend={-1.2} />
            <MetricCard title="Memory Pressure" value={metrics?.neural?.mem} unit="%" icon={Cpu} trend={0.5} />
            <MetricCard title="CPU Jitter" value={metrics?.neural?.jitter} unit="μs" icon={Activity} trend={-0.1} />
            <MetricCard title="Queue Depth" value={metrics?.neural?.queue} unit="pkts" icon={Terminal} trend={4.1} />
          </div>

          {/* Cluster 2: System Health */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <Database size={16} /> <span className="text-xs font-mono uppercase tracking-widest">System Health</span>
            </div>
            <MetricCard title="Active Nodes" value={metrics?.health?.nodes} unit="" icon={Globe} trend={0} />
            <MetricCard title="Redis Hit Rate" value={metrics?.health?.redis} unit="%" icon={Zap} trend={1.1} />
            <MetricCard title="Postgres IOPS" value={metrics?.health?.iops} unit="op/s" icon={Database} trend={0.8} />
            <MetricCard title="gRPC Status" value={metrics?.health?.grpc} unit="" icon={RefreshCw} trend={0} />
            <MetricCard title="Auth Latency" value={metrics?.health?.auth} unit="" icon={Lock} trend={-0.4} />
          </div>

          {/* Cluster 3: Security Layer */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <Shield size={16} /> <span className="text-xs font-mono uppercase tracking-widest">Security Layer</span>
            </div>
            <MetricCard title="Threat Level" value={metrics?.security?.threat} unit="" icon={AlertTriangle} trend={0} />
            <MetricCard title="WAF Blocks" value={metrics?.security?.waf} unit="req" icon={Shield} trend={12.5} />
            <MetricCard title="SSH Attempts" value={metrics?.security?.ssh} unit="try" icon={Lock} trend={-2.1} />
            <MetricCard title="Key Rotation" value={metrics?.security?.rotation} unit="" icon={RefreshCw} trend={0} />
            <MetricCard title="Audit Stream" value={metrics?.security?.audit} unit="" icon={Terminal} trend={0} />
          </div>

          {/* Cluster 4: Quantum State */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <Cpu size={16} /> <span className="text-xs font-mono uppercase tracking-widest">Quantum State</span>
            </div>
            <MetricCard title="Entropy Level" value={metrics?.quantum?.entropy} unit="bits" icon={Zap} trend={0.01} />
            <MetricCard title="Packet Loss" value={metrics?.quantum?.loss} unit="" icon={Activity} trend={-0.02} />
            <MetricCard title="Jitter Buffer" value={metrics?.quantum?.jitterB} unit="" icon={RefreshCw} trend={0.1} />
            <MetricCard title="Sync Offset" value={metrics?.quantum?.sync} unit="" icon={Globe} trend={0} />
            <MetricCard title="Clock Drift" value={metrics?.quantum?.drift} unit="" icon={Terminal} trend={0.05} />
          </div>
        </motion.div>

        {/* Footer Signature */}
        <footer className="mt-8 flex justify-between items-center opacity-40 text-[10px] font-mono uppercase tracking-widest">
          <div>SYSTEM_STATUS: OPERATIONAL // ENCRYPTION: AES-256-GCM</div>
          <div>© 2025-2030 Nagabhushana Raju S // ORCMEGA-AI</div>
        </footer>
      </div>
    </div>
  );
}
```