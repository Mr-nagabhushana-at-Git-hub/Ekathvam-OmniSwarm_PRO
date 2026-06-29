<thinking>
The user is demanding a "Super Hyper-Engineered" implementation of Page 5. The previous attempt was rejected for being too "superficial." 

**Key Failures to Address:**
1.  **Theme Engine**: I need a real CSS variable mapping system that updates the DOM based on the Zustand state.
2.  **Typography**: I must actually load the fonts (JetBrains Mono, etc.) via a style block or Google Fonts API.
3.  **Advanced Shaders**: I need to write actual GLSL code for a `shaderMaterial` to create a "Neural Mesh" effect, moving beyond basic Drei materials.
4.  **Backend Wiring**: I will implement a `gRPC-Web` style service layer with a defined interface and a mock transport that mimics the Rust backend's behavior more realistically.
5.  **Component Diversity**: I will replace the 20 identical cards with a variety of "Micro-Components": `MetricCard`, `StatusRing`, `Sparkline`, and `LogStream`.

**Architectural Plan:**
- **Theme System**: Create a `THEME_MAP` object. Use a `useEffect` to inject these variables into `:root`.
- **Font System**: Inject a `<style>` tag with `@import` for JetBrains Mono and Inter.
- **Shader**: Write a custom `ShaderMaterial` using a Simplex Noise function in GLSL to create a morphing, glowing neural network mesh.
- **Components**: 
    - 5 `MetricCard` (Standard value/trend).
    - 5 `StatusRing` (Circular progress for CPU/RAM).
    - 5 `Sparkline` (SVG-based mini-graphs).
    - 5 `LogStream` (Real-time scrolling text).
- **Backend**: Create a `RustService` class that handles `request/response` patterns with typed interfaces.
</thinking>

```tsx
/**
 * @file DashboardPage5_HyperEngineered.tsx
 * @description Page 5 of 20: The System Nexus.
 * Implementation: Custom GLSL Shaders, Dynamic Theme Engine, Multi-Font Injection,
 * Diversified Micro-Components, and gRPC-Web simulated Rust Backend.
 * 
 * Author: Nagabhushana Raju S
 * Copyright: (c) 2025-2030 Nagabhushana Raju S
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Activity, Cpu, Database, Shield, Zap, 
  Globe, Lock, Server, RefreshCw, Layers,
  BarChart3, Gauge, Terminal, Wifi, HardDrive,
  Network, Key, Eye, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { create } from 'zustand';

// --- 1. THEME ENGINE CONFIGURATION ---
const THEME_MAP = {
  dark: {
    '--bg': '#020617',
    '--panel': 'rgba(15, 23, 42, 0.6)',
    '--accent': '#6366f1',
    '--accent-glow': 'rgba(99, 102, 241, 0.3)',
    '--text': '#f8fafc',
    '--text-dim': '#94a3b8',
    '--border': 'rgba(255, 255, 255, 0.1)',
  },
  cyber: {
    '--bg': '#0a0a0f',
    '--panel': 'rgba(20, 20, 30, 0.7)',
    '--accent': '#00ffc3',
    '--accent-glow': 'rgba(0, 255, 195, 0.3)',
    '--text': '#e0e0ff',
    '--text-dim': '#707090',
    '--border': 'rgba(0, 255, 195, 0.2)',
  },
  emerald: {
    '--bg': '#061a14',
    '--panel': 'rgba(10, 30, 25, 0.6)',
    '--accent': '#10b981',
    '--accent-glow': 'rgba(16, 185, 129, 0.3)',
    '--text': '#ecfdf5',
    '--text-dim': '#6ee7b7',
    '--border': 'rgba(16, 185, 129, 0.2)',
  },
  light: {
    '--bg': '#f8fafc',
    '--panel': 'rgba(255, 255, 255, 0.7)',
    '--accent': '#4f46e5',
    '--accent-glow': 'rgba(79, 70, 229, 0.2)',
    '--text': '#0f172a',
    '--text-dim': '#64748b',
    '--border': 'rgba(0, 0, 0, 0.1)',
  }
};

interface AppState {
  theme: keyof typeof THEME_MAP;
  font: 'inter' | 'jetbrains' | 'montreal';
  setTheme: (theme: keyof typeof THEME_MAP) => void;
  setFont: (font: 'inter' | 'jetbrains' | 'montreal') => void;
}

const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  font: 'jetbrains',
  setTheme: (theme) => set({ theme }),
  setFont: (font) => set({ font }),
}));

// --- 2. FONT INJECTION ---
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');
    :root {
      --font-inter: 'Inter', sans-serif;
      --font-jetbrains: 'JetBrains Mono', monospace;
      --font-montreal: 'Neue Montreal', sans-serif;
    }
  `}</style>
);

// --- 3. ADVANCED GLSL NEURAL SHADER ---
const NeuralMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const shaderData = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#6366f1') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vDistort;
      uniform float uTime;
      
      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          .x + i.x );
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vUv = uv;
        vDistort = snoise(uv * 3.0 + uTime * 0.2);
        vec3 newPos = position + normal * vDistort * 0.3;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vDistort;
      uniform float uTime;
      uniform vec3 uColor;

      void main() {
        float glow = vDistort * 0.5 + 0.5;
        vec3 finalColor = mix(uColor * 0.2, uColor, glow);
        gl_FragColor = vec4(finalColor, 0.8);
      }
    `
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial 
        vertexShader={shaderData.vertexShader} 
        fragmentShader={shaderData.fragmentShader} 
        uniforms={shaderData.uniforms} 
        transparent 
      />
    </mesh>
  );
};

// --- 4. DIVERSIFIED MICRO-COMPONENTS ---

const MetricCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] backdrop-blur-xl transition-all hover:border-[var(--accent)] group">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]`}>
        <Icon size={16} />
      </div>
      <span className={`text-[10px] font-mono ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{trend}</span>
    </div>
    <div className="text-xs text-[var(--text-dim)] mb-1">{label}</div>
    <div className="text-xl font-bold text-[var(--text)]">{value}</div>
  </motion.div>
);

const StatusRing = ({ label, percent, color }: any) => (
  <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] backdrop-blur-xl flex items-center gap-4">
    <div className="relative w-12 h-12">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/10" strokeWidth="3" />
        <circle cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="3" 
          strokeDasharray={`${percent}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--text)]">{percent}%</span>
    </div>
    <div>
      <div className="text-xs text-[var(--text-dim)]">{label}</div>
      <div className="text-sm font-bold text-[var(--text)]">Active</div>
    </div>
  </motion.div>
);

const Sparkline = ({ label, points }: any) => (
  <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] backdrop-blur-xl">
    <div className="text-xs text-[var(--text-dim)] mb-3">{label}</div>
    <svg className="w-full h-10 overflow-visible">
      <polyline 
        fill="none" stroke="var(--accent)" strokeWidth="2" 
        points={points.map((p: number, i: number) => `${(i * 25)},${40 - p}`).join(' ')} 
      />
    </svg>
  </motion.div>
);

const LogStream = ({ logs }: any) => (
  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] backdrop-blur-xl font-mono text-[10px] h-32 overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[var(--panel)] pointer-events-none" />
    <div className="space-y-1">
      {logs.map((log: string, i: number) => (
        <div key={i} className="flex gap-2">
          <span className="text-indigo-400">[{new Date().toLocaleTimeString()}]</span>
          <span className="text-[var(--text-dim)]">{log}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- 5. RUST gRPC-WEB SERVICE LAYER ---
class RustBackendService {
  static async request<T>(endpoint: string, payload: any): Promise<T> {
    // Simulate gRPC-Web transport overhead
    await new Promise(r => setTimeout(r, 60));
    
    const mockData: any = {
      'get_system_metrics': {
        vitals: { cpu: 14, ram: 42, disk: 12, net: 88, latency: 0.2 },
        neural: { tokens: 12400, speed: 92, queue: 1, cache: 98, version: 'v5.1-alpha' },
        security: { firewall: 'ON', auths: 450, threat: 'LOW', encrypt: 'ChaCha20', audit: 'OK' },
        cluster: { redis: 1200, iops: 45000, grpc: 1200, workers: 16, sync: 'OK' },
      }
    };
    return mockData[endpoint];
  }
}

// --- 6. MAIN COMPOSITION ---
export default function DashboardPage5() {
  const { theme, font, setTheme, setFont } = useAppStore();
  const [data, setData] = useState<any>(null);

  // Apply Theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = THEME_MAP[theme];
    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  useEffect(() => {
    RustBackendService.request('get_system_metrics', {}).then(setData);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  if (!data) return <div className="h-screen w-screen flex items-center justify-center text-white font-mono bg-slate-950">BOOTING_RUST_KERNEL...</div>;

  return (
    <div className={`min-h-screen w-full text-[var(--text)] transition-colors duration-500 bg-[var(--bg)] ${
      font === 'jetbrains' ? 'font-jetbrains' : font === 'inter' ? 'font-inter' : 'font-montreal'
    }`}>
      <FontLoader />
      
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <NeuralMesh />
          </Float>
          <OrbitControls enableZoom={false} autoRotate />
        </Canvas>
      </div>

      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)]">
            <Layers size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter">SKELETON<span className="text-[var(--accent)]">PULSE</span></h1>
        </div>

        <div className="flex gap-4">
          <div className="flex bg-white/5 p-1 rounded-full border border-[var(--border)]">
            {(['dark', 'cyber', 'emerald', 'light'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`px-3 py-1 rounded-full text-[10px] uppercase transition-all ${theme === t ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-dim)] hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex bg-white/5 p-1 rounded-full border border-[var(--border)]">
            {(['inter', 'jetbrains', 'montreal'] as const).map(f => (
              <button key={f} onClick={() => setFont(f)}
                className={`px-3 py-1 rounded-full text-[10px] uppercase transition-all ${font === f ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-dim)] hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-8 max-w-7xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Cluster 1: Vitals (MetricCards) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--accent)] mb-4">
              <Activity size={16} /> <span className="text-xs font-bold uppercase tracking-widest">System Vitals</span>
            </div>
            <MetricCard icon={Cpu} label="CPU Load" value={`${data.vitals.cpu}%`} trend="+1.2%" />
            <MetricCard icon={HardDrive} label="RAM Usage" value={`${data.vitals.ram}%`} trend="-0.4%" />
            <MetricCard icon={Database} label="Disk I/O" value={`${data.vitals.disk}MB/s`} trend="stable" />
            <MetricCard icon={Wifi} label="Net Flow" value={`${data.vitals.net}Gbps`} trend="+12%" />
            <MetricCard icon={Gauge} label="Latency" value={`${data.vitals.latency}ms`} trend="-0.1ms" />
          </div>

          {/* Cluster 2: Neural (StatusRings) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--accent)] mb-4">
              <Zap size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Neural Engine</span>
            </div>
            <StatusRing label="Token Throughput" percent={data.neural.cache} color="var(--accent)" />
            <StatusRing label="Inference Speed" percent={data.neural.speed} color="#3b82f6" />
            <StatusRing label="Cache Efficiency" percent={98} color="#10b981" />
            <StatusRing label="Queue Saturation" percent={data.neural.queue * 10} color="#f59e0b" />
            <StatusRing label="Model Stability" percent={100} color="#8b5cf6" />
          </div>

          {/* Cluster 3: Security (Sparklines) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--accent)] mb-4">
              <Shield size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Security Layer</span>
            </div>
            <Sparkline label="Auth Requests/s" points={[10, 20, 15, 30, 25, 40, 35]} />
            <Sparkline label="Threat Vector" points={[5, 5, 10, 5, 2, 8, 4]} />
            <Sparkline label="Encryption Load" points={[30, 32, 31, 35, 33, 30, 31]} />
            <Sparkline label="Firewall Drops" points={[0, 2, 0, 1, 0, 5, 0]} />
            <Sparkline label="Audit Frequency" points={[20, 20, 20, 20, 20, 20, 20]} />
          </div>

          {/* Cluster 4: Global (LogStreams) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--accent)] mb-4">
              <Server size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Global State</span>
            </div>
            <LogStream logs={["Redis: Key-space sync complete", "Postgres: Vacuuming index_01", "gRPC: Stream established", "Worker-04: Heartbeat OK", "Cluster: Syncing nodes..."]} />
            <LogStream logs={["Auth: JWT rotation triggered", "Sec: AES-GCM handshake", "Net: Packet loss 0.001%", "Kernel: Context switch opt", "Sentry: No errors detected"]} />
            <LogStream logs={["Neural: Weights updated", "Neural: KV-Cache purged", "Neural: Batch size 32", "Neural: Temp 0.7", "Neural: Top-P 0.9"]} />
            <LogStream logs={["Disk: SSD Wear 0.1%", "Disk: IOPS Peak 45k", "Disk: Write-ahead log sync", "Disk: Page cache hit 99%", "Disk: Ready"]} />
            <LogStream logs={["System: Uptime 142d", "System: Load Avg 0.4", "System: Entropy OK", "System: Clock synced", "System: Ready"]} />
          </div>

        </motion.div>
      </main>

      <footer className="fixed bottom-0 w-full p-4 flex justify-between items-center text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-widest pointer-events-none">
        <div>SYSTEM_STATUS: <span className="text-emerald-500">OPTIMAL</span></div>
        <div className="flex gap-4">
          <span>Nagabhushana Raju S // Engineer</span>
          <span>ORCMEGA-AI © 2025</span>
        </div>
      </footer>
    </div>
  );
}
```