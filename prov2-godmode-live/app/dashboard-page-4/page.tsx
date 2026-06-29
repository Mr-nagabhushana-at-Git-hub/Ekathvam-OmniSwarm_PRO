<thinking>
The objective is to build **Page 4 of 20** (`dashboard-page-4`) for the "OmniSwarm — GodMode V2 Ultra" project. 

**1. Visual & Technical Strategy:**
- **ThreeJS Shader**: I will implement a *Quantum Flux Field*. This will be a custom GLSL shader using a `PlaneGeometry` with high subdivision. The vertex shader will use a combination of 3D Perlin noise and a sine-wave ripple to create a "liquid data" surface. The fragment shader will implement a "chromatic aberration" effect on the edges of the waves, reacting to the Rust backend's data throughput.
- **Composition**: A "Bento-Grid" layout on steroids. I'll use a CSS Grid system with `grid-template-areas` to organize 20 micro-components.
- **Animations**: Using `framer-motion` for `StaggerChildren`. The entrance will be a "cascade" effect where the 3D scene fades in first, followed by the grid components sliding in from the bottom with a spring physics transition.
- **Typography**: Implementation of a multi-font system: `JetBrains Mono` for data/code, `Inter` for UI, and a high-impact display font (e.g., `Syncopate`) for headers.
- **Theming**: A CSS Variable-based system supporting `Light`, `Dark`, and `Cyber-Neon` modes.
- **Backend Integration**: A simulated high-performance Rust-to-TS bridge using a WebSocket-like hook (`useRustStream`) that feeds real-time telemetry into the ThreeJS uniforms and component states.

**2. Component Architecture:**
- `QuantumFluxCanvas`: The ThreeJS wrapper.
- `BentoGrid`: The layout orchestrator.
- `MicroComponent`: A generic wrapper for the 20 specialized widgets (e.g., `NeuralLoad`, `PacketStream`, `EntropyGauge`, etc.).
- `ThemeController`: The global state manager for visual modes.

**3. Performance Constraints:**
- Use `React.memo` for all 20 micro-components to prevent unnecessary re-renders during high-frequency data updates.
- ThreeJS `requestAnimationFrame` loop optimized to avoid memory leaks.
- CSS `will-change: transform` for entrance animations.
</thinking>

```tsx
/**
 * OmniSwarm — GodMode V2 Ultra
 * Page 4: Quantum Flux Dashboard
 * 
 * Author: Nagabhushana Raju S
 * Signature: https://www.mr-nagabhushanaraju-s.engineer
 */

import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Cpu, Globe, Zap, Shield, Database, 
  Layers, Terminal, Radio, Gauge, Lock, Wifi, 
  RefreshCw, AlertCircle, Box, Share2, Eye, Settings, 
  Wind, Command 
} from 'lucide-react';

// --- TYPES & SCHEMAS ---
type ThemeMode = 'dark' | 'light' | 'neon';

interface RustTelemetry {
  cpuLoad: number;
  memoryUsage: number;
  networkThroughput: number;
  entropy: number;
  activeNodes: number;
  latency: number;
}

// --- SHADERS: Quantum Flux Field ---
const QuantumFluxShader = {
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 1.0 },
    uColorA: { value: new THREE.Color('#00f2ff') },
    uColorB: { value: new THREE.Color('#7000ff') },
  },
  vertexShader: `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    
    // GLSL Simplex Noise 3D
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(0.0, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.xyz );
      vec3 i2 = max( g.xyz, l.xyz );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x_ = x_ * ns.x + ns.yyyy;
      vec4 y_ = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x_) - abs(y_);
      vec4 b0 = vec4( x_ .xy, y_.xy );
      vec4 b1 = vec4( x_ .zw, y_.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vElevation = snoise(vec3(position.xy * 0.5, uTime * 0.2)) * 2.0;
      vec3 newPos = position + normal * vElevation;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    void main() {
      float mixStrength = (vElevation + 2.0) / 4.0;
      vec3 finalColor = mix(uColorA, uColorB, mixStrength);
      gl_FragColor = vec4(finalColor, 0.8);
    }
  `,
};

const FluxMesh = ({ intensity, theme }: { intensity: number, theme: ThemeMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const colors = useMemo(() => {
    if (theme === 'neon') return { a: '#ff00ff', b: '#00ffff' };
    if (theme === 'light') return { a: '#4f46e5', b: '#06b6d4' };
    return { a: '#00f2ff', b: '#7000ff' };
  }, [theme]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uIntensity.value = intensity;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20, 128, 128]} />
      <shaderMaterial 
        fragmentShader={QuantumFluxShader.fragmentShader}
        vertexShader={QuantumFluxShader.vertexShader}
        uniforms={{
          ...QuantumFluxShader.uniforms,
          uColorA: { value: new THREE.Color(colors.a) },
          uColorB: { value: new THREE.Color(colors.b) },
        }}
        transparent
      />
    </mesh>
  );
};

// --- MICRO-COMPONENTS ---
const MicroWidget = memo(({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  type = 'default' 
}: any) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, translateY: -5 }}
      className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300
        ${type === 'highlight' ? 'bg-accent/20 border-accent shadow-[0_0_15px_rgba(0,242,255,0.2)]' : 'bg-panel/50 border-border'}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-lg bg-bg-active border border-border">
          <Icon size={16} className="text-accent" />
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      </div>
      <div className="space-y-1">
        <h4 className="text-text-3 text-xs font-medium uppercase tracking-wider">{title}</h4>
        <p className="text-text font-bold text-xl font-mono">{value}</p>
      </div>
    </motion.div>
  );
});

// --- MAIN PAGE COMPONENT ---
export default function DashboardPage4() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [telemetry, setTelemetry] = useState<RustTelemetry>({
    cpuLoad: 0, memoryUsage: 0, networkThroughput: 0, entropy: 0, activeNodes: 0, latency: 0
  });

  // Simulate Rust Backend Stream
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        cpuLoad: 40 + Math.random() * 20,
        memoryUsage: 60 + Math.random() * 10,
        networkThroughput: 800 + Math.random() * 400,
        entropy: Math.random() * 100,
        activeNodes: 120 + Math.floor(Math.random() * 20),
        latency: 12 + Math.random() * 5,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const widgets = [
    { title: 'Neural Load', value: `${telemetry.cpuLoad.toFixed(1)}%`, icon: Cpu, trend: 2.4, type: 'highlight' },
    { title: 'Mem Flux', value: `${telemetry.memoryUsage.toFixed(1)}GB`, icon: Database, trend: -1.2 },
    { title: 'Net Throughput', value: `${telemetry.networkThroughput.toFixed(0)}MB/s`, icon: Wifi, trend: 15.8, type: 'highlight' },
    { title: 'System Entropy', value: `${telemetry.entropy.toFixed(2)} bits`, icon: Zap, trend: 0.4 },
    { title: 'Active Swarm', value: telemetry.activeNodes, icon: Globe, trend: 8.1 },
    { title: 'Core Latency', value: `${telemetry.latency.toFixed(2)}ms`, icon: Activity, trend: -4.2 },
    { title: 'Security Layer', value: 'Active', icon: Shield, trend: 0 },
    { title: 'Packet Loss', value: '0.001%', icon: Radio, trend: -0.1 },
    { title: 'IOPS', value: '42.1k', icon: Gauge, trend: 12.4 },
    { title: 'Encryption', value: 'AES-GCM', icon: Lock, trend: 0 },
    { title: 'Sync Rate', value: '99.9%', icon: RefreshCw, trend: 0.1 },
    { title: 'Alerts', value: '0', icon: AlertCircle, trend: 0 },
    { title: 'Cluster Vol', value: '1.2TB', icon: Box, trend: 5.6 },
    { title: 'API Calls', value: '1.2M', icon: Share2, trend: 22.1, type: 'highlight' },
    { title: 'Uptime', value: '99.99%', icon: Eye, trend: 0 },
    { title: 'Config', value: 'v2.4.0', icon: Settings, trend: 0 },
    { title: 'Airflow', value: 'Optimal', icon: Wind, trend: 0 },
    { title: 'Kernel', value: 'Rust-LTS', icon: Command, trend: 0 },
    { title: 'Layers', value: '12', icon: Layers, trend: 0 },
    { title: 'Logs', value: 'Streaming', icon: Terminal, trend: 0 },
  ];

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#0a0a0c] text-white' : 
      theme === 'light' ? 'bg-[#f5f5f7] text-slate-900' : 
      'bg-[#050010] text-cyan-400'
    }`}>
      {/* Theme Switcher */}
      <div className="fixed top-6 right-6 z-50 flex gap-2 p-1 bg-bg-panel border border-border rounded-full backdrop-blur-xl">
        {(['dark', 'light', 'neon'] as ThemeMode[]).map((m) => (
          <button 
            key={m}
            onClick={() => setTheme(m)}
            className={`px-4 py-1 rounded-full text-[10px] uppercase font-bold transition-all ${
              theme === m ? 'bg-accent text-bg shadow-[0_0_10px_var(--accent)]' : 'hover:bg-bg-hover'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Header Section */}
      <header className="relative z-10 p-8 max-w-7xl mx-auto flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-5xl font-black tracking-tighter font-display italic">
            QUANTUM <span className="text-accent">FLUX</span>
          </h1>
          <p className="text-text-3 font-mono text-sm opacity-60">
            SYSTEM_STATUS: <span className="text-success">OPTIMAL</span> // NODE_ID: OS-V2-ULTRA-04
          </p>
        </motion.div>
        
        <div className="hidden md:block text-right font-mono text-[10px] text-text-3 space-y-1">
          <p>LATENCY: {telemetry.latency.toFixed(2)}ms</p>
          <p>THROUGHPUT: {telemetry.networkThroughput.toFixed(0)} MB/S</p>
          <p>SIGNATURE: NAGABHUSHANA_RAJU_S</p>
        </div>
      </header>

      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <FluxMesh intensity={telemetry.cpuLoad / 100} theme={theme} />
          </Float>
        </Canvas>
      </div>

      {/* Bento Grid Composition */}
      <main className="relative z-10 max-w-7xl mx-auto p-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {widgets.map((w, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <MicroWidget {...w} />
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer Signature */}
      <footer className="relative z-10 p-8 text-center font-mono text-[10px] text-text-3 opacity-40">
        © 2025-2030 NAGABHUSHANA RAJU S // ORCMEGA-AI // SECURE_BUILD_V2_ULTRA
      </footer>

      <style jsx global>{`
        :root {
          --accent: #00f2ff;
          --accent-glow: rgba(0, 242, 255, 0.5);
          --bg: #0a0a0c;
          --bg-panel: rgba(20, 20, 25, 0.7);
          --bg-active: rgba(40, 40, 50, 0.5);
          --bg-hover: rgba(60, 60, 70, 0.5);
          --border: rgba(255, 255, 255, 0.1);
          --text: #ffffff;
          --text-2: #a1a1aa;
          --text-3: #71717a;
          --success: #10b981;
          --error: #ef4444;
          --radius: 12px;
        }

        .theme-light {
          --accent: #4f46e5;
          --bg: #f5f5f7;
          --bg-panel: rgba(255, 255, 255, 0.7);
          --bg-active: rgba(240, 240, 245, 0.5);
          --bg-hover: rgba(230, 230, 235, 0.5);
          --border: rgba(0, 0, 0, 0.1);
          --text: #18181b;
          --text-2: #52525b;
          --text-3: #71717a;
        }

        .theme-neon {
          --accent: #ff00ff;
          --bg: #050010;
          --bg-panel: rgba(20, 0, 40, 0.7);
          --bg-active: rgba(40, 0, 80, 0.5);
          --bg-hover: rgba(60, 0, 120, 0.5);
          --border: rgba(255, 0, 255, 0.3);
          --text: #00ffff;
          --text-2: #ff00ff;
          --text-3: #bc00ff;
        }

        .font-display { font-family: 'Syncopate', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
}
```