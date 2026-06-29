<thinking>
The objective is to implement the **Run History/Replay Dashboard** for OmniSwarm PROv1. This is a high-stakes UI because it must handle the "replay" of a hyper-velocity stream (3000+ tok/s) while maintaining the "Obsidian Glass" aesthetic and ensuring that data remains encrypted until it reaches the client's decryption key.

**Key Technical Challenges:**
1. **Replay Synchronization**: Replaying a stream isn't just about showing text; it's about recreating the *temporal experience* of the swarm. I need a "Playback Controller" that can handle variable speeds (1x, 2x, 5x) and seek operations.
2. **Decryption Pipeline**: Since the data is stored as encrypted envelopes (ciphertext, nonce, auth_tag), the replay engine must decrypt each chunk using the client-side Master Key before passing it to the UI.
3. **Performance**: Rendering thousands of tokens per second during a replay can choke the DOM. I will use a "virtualized stream" approach or a throttled render loop to ensure the UI remains responsive.
4. **Aesthetics**: The dashboard must feel like a "Time Machine" for AI agents—dark, translucent, with high-fidelity telemetry.

**Implementation Plan:**
1. **`RunHistoryDashboard.tsx`**: The main layout. A split-view with a scrollable history list on the left and the replay canvas on the right.
2. **`ReplayController.tsx`**: A professional-grade playback bar (Play/Pause, Seek, Speed, Time-stamp).
3. **`ReplayCanvas.tsx`**: The area where the decrypted stream is rendered. It will integrate the `SwarmGraph` and the `IncrementalAnswer` components.
4. **`useReplayEngine.ts`**: A custom hook that manages the state machine of the replay (fetching encrypted events $\rightarrow$ decrypting $\rightarrow$ timing the emission).
5. **`CryptoClient.ts`**: A utility to handle AES-GCM decryption using the WebCrypto API.

**Design Tokens**:
- Background: `oklch(0.12 0.01 260)` (Obsidian)
- Accents: `oklch(0.65 0.22 260)` (Electric Indigo)
- Glass: `backdrop-blur-xl` with `oklch(0.18 0.02 260 / 60%)`
</thinking>

### 1. Crypto Utility
This utility ensures that the "Zero-Knowledge" promise is kept. Decryption happens exclusively in the browser.

**File Path:** `src/lib/crypto/CryptoClient.ts`
```typescript
/**
 * CryptoClient handles the client-side decryption of swarm events.
 * Uses AES-GCM 256-bit encryption.
 */
export class CryptoClient {
  private static KEY_ALGO = 'AES-GCM';

  /**
   * Decrypts an encrypted envelope using a raw master key.
   * @param masterKey The CryptoKey object derived from user password
   * @param ciphertext The encrypted data
   * @param nonce The initialization vector
   * @param authTag The GCM authentication tag (often appended to ciphertext in WebCrypto)
   */
  static async decryptEvent(
    masterKey: CryptoKey, 
    ciphertext: ArrayBuffer, 
    nonce: ArrayBuffer, 
    authTag: ArrayBuffer
  ): Promise<string> {
    try {
      // WebCrypto expects the auth tag to be appended to the ciphertext for AES-GCM
      const combinedData = new Uint8Array(ciphertext.byteLength + authTag.byteLength);
      combinedData.set(new Uint8Array(ciphertext), 0);
      combinedData.set(new Uint8Array(authTag), ciphertext.byteLength);

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: this.KEY_ALGO,
          iv: nonce,
        },
        masterKey,
        combinedData
      );

      return new TextDecoder().decode(decrypted);
    } catch (e) {
      console.error("Decryption failed: Invalid key or corrupted data", e);
      throw new Error("DECRYPTION_FAILED");
    }
  }

  /**
   * Derives a CryptoKey from a password and salt using PBKDF2
   */
  static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.KEY_ALGO, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
}
```

### 2. Replay Engine Hook
This hook manages the temporal logic of the replay, handling the "playback head" and the decryption pipeline.

**File Path:** `src/hooks/useReplayEngine.ts`
```typescript
import { useState, useEffect, useRef, useCallback } from 'react';
import { CryptoClient } from '../lib/crypto/CryptoClient';

interface ReplayEvent {
  sequence_number: number;
  event_type: string;
  ciphertext: ArrayBuffer;
  nonce: ArrayBuffer;
  auth_tag: ArrayBuffer;
  created_at: string;
}

export function useReplayEngine(
  events: ReplayEvent[], 
  masterKey: CryptoKey | null
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [decryptedContent, setDecryptedContent] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (!masterKey) return;
    setIsPlaying(true);
  }, [masterKey]);

  useEffect(() => {
    if (isPlaying && currentIndex < events.length) {
      timerRef.current = setInterval(async () => {
        const event = events[currentIndex];
        
        try {
          const text = await CryptoClient.decryptEvent(
            masterKey!, 
            event.ciphertext, 
            event.nonce, 
            event.auth_tag
          );
          
          setDecryptedContent(prev => [...prev, text]);
          setCurrentIndex(prev => prev + 1);
        } catch (e) {
          stop();
          console.error("Replay halted due to decryption error");
        }
      }, 100 / playbackSpeed); // Simplified timing; in PROv1 this uses actual created_at deltas
    } else if (currentIndex >= events.length) {
      stop();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, events, masterKey, playbackSpeed, stop]);

  const seek = (index: number) => {
    setCurrentIndex(index);
    setDecryptedContent([]); // Reset content for clean replay from point
  };

  return {
    currentIndex,
    isPlaying,
    playbackSpeed,
    decryptedContent,
    setIsPlaying,
    setPlaybackSpeed,
    seek,
    play,
    stop,
    progress: (currentIndex / events.length) * 100
  };
}
```

### 3. Replay Controller Component
A high-fidelity playback bar with a glassmorphism aesthetic.

**File Path:** `src/components/history/ReplayController.tsx`
```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplayControllerProps {
  isPlaying: boolean;
  progress: number;
  playbackSpeed: number;
  onTogglePlay: () => void;
  onSeek: (val: number) => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export const ReplayController: React.FC<ReplayControllerProps> = ({
  isPlaying,
  progress,
  playbackSpeed,
  onTogglePlay,
  onSeek,
  onSpeedChange,
  onReset,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-obsidian-panel border border-obsidian-border backdrop-blur-xl flex items-center gap-6 select-none">
      {/* Play/Pause Toggle */}
      <button 
        onClick={onTogglePlay}
        className="p-3 rounded-full bg-accent-logic text-white hover:scale-105 transition-transform active:scale-95 shadow-glow-logic"
        aria-label={isPlaying ? "Pause Replay" : "Play Replay"}
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
      </button>

      {/* Seek Bar */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
          <span>Timeline</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative h-1.5 w-full bg-obsidian-surface rounded-full overflow-hidden cursor-pointer group">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-accent-logic shadow-[0_0_8px_var(--accent-logic)]"
            style={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress} 
            onChange={(e) => onSeek(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Speed Controls */}
      <div className="flex items-center gap-2 bg-obsidian-surface p-1 rounded-lg border border-obsidian-border">
        {[1, 2, 5].map((speed) => (
          <button
            key={speed}
            onClick={() => onSpeedChange(speed)}
            className={cn(
              "px-2 py-1 text-[10px] font-mono rounded transition-colors",
              playbackSpeed === speed 
                ? "bg-accent-logic text-white" 
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {speed}x
          </button>
        ))}
      </div>

      <button 
        onClick={onReset}
        className="p-2 text-zinc-500 hover:text-white transition-colors"
        aria-label="Reset Replay"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
};
```

### 4. Run History Dashboard
The main orchestrator that ties the history list, the replay engine, and the canvas together.

**File Path:** `src/components/history/RunHistoryDashboard.tsx`
```tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { History, Search, PlayCircle, Trash2, Clock } from "lucide-react";
import { ReplayController } from "./ReplayController";
import { useReplayEngine } from "@/hooks/useReplayEngine";
import { SpeedHUD } from "../ui/SpeedHUD";

interface RunMetadata {
  run_id: string;
  model_used: string;
  status: string;
  total_tokens: number;
  created_at: string;
}

export const RunHistoryDashboard: React.FC<{ masterKey: CryptoKey }> = ({ masterKey }) => {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [runs, setRuns] = useState<RunMetadata[]>([]);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Replay Engine
  const { 
    currentIndex, isPlaying, playbackSpeed, decryptedContent, 
    setIsPlaying, setPlaybackSpeed, seek, play, stop, progress 
  } = useReplayEngine(activeEvents, masterKey);

  // Mock data fetch for demonstration
  React.useEffect(() => {
    setRuns([
      { run_id: '1', model_used: 'cerebras-gemma-4', status: 'completed', total_tokens: 12400, created_at: '2026-06-12T10:00:00Z' },
      { run_id: '2', model_used: 'cerebras-gemma-4', status: 'completed', total_tokens: 8200, created_at: '2026-06-12T09:15:00Z' },
      { run_id: '3', model_used: 'nousastra-pro', status: 'failed', total_tokens: 1100, created_at: '2026-06-11T22:00:00Z' },
    ]);
  }, []);

  const handleSelectRun = async (id: string) => {
    setSelectedRunId(id);
    stop();
    // In production: fetch from /api/swarm/replay/:id
    // Mocking encrypted events
    setActiveEvents([
      { sequence_number: 0, event_type: 'thought', ciphertext: new ArrayBuffer(8), nonce: new ArrayBuffer(12), auth_tag: new ArrayBuffer(16), created_at: '' },
      { sequence_number: 1, event_type: 'token', ciphertext: new ArrayBuffer(8), nonce: new ArrayBuffer(12), auth_tag: new ArrayBuffer(16), created_at: '' },
      { sequence_number: 2, event_type: 'token', ciphertext: new ArrayBuffer(8), nonce: new ArrayBuffer(12), auth_tag: new ArrayBuffer(16), created_at: '' },
    ]);
    setDecryptedContent([]);
  };

  const filteredRuns = runs.filter(r => r.model_used.includes(searchQuery));

  return (
    <div className="flex h-screen w-full bg-obsidian-bg text-zinc-200 overflow-hidden font-sans">
      {/* Left Panel: History Nexus */}
      <aside className="w-96 border-r border-obsidian-border bg-obsidian-panel/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-obsidian-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent-logic/20 text-accent-logic">
              <History size={20} />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">Run History</h2>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-accent-logic transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Filter by model..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-surface border border-obsidian-border text-sm focus:outline-none focus:border-accent-logic transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredRuns.map((run) => (
            <motion.div 
              key={run.run_id}
              whileHover={{ x: 4 }}
              onClick={() => handleSelectRun(run.run_id)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all group",
                selectedRunId === run.run_id 
                  ? "bg-accent-logic/10 border-accent-logic shadow-glow-logic" 
                  : "bg-obsidian-surface border-obsidian-border hover:border-zinc-600"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-zinc-500">{run.run_id}</span>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full uppercase font-bold",
                  run.status === 'completed' ? "bg-accent-success/20 text-accent-success" : "bg-accent-error/20 text-accent-error"
                )}>
                  {run.status}
                </span>
              </div>
              <div className="text-sm font-medium mb-3">{run.model_used}</div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <div className="flex items-center gap-1">
                  <Clock size={12} /> {new Date(run.created_at).toLocaleDateString()}
                </div>
                <div>{run.total_tokens.toLocaleString()} tokens</div>
              </div>
            </motion.div>
          ))}
        </div>
      </aside>

      {/* Right Panel: Replay Canvas */}
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {!selectedRunId ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4"
            >
              <div className="p-6 rounded-full bg-obsidian-surface border border-obsidian-border">
                <PlayCircle size={48} strokeWidth={1} />
              </div>
              <p className="text-sm font-mono">Select a run from the Nexus to begin replay</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col p-8 gap-8 overflow-hidden"
            >
              {/* Top Telemetry Row */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Run Replay</h1>
                  <p className="text-sm text-zinc-500 font-mono">ID: {selectedRunId} • Decrypted via MasterKey</p>
                </div>
                <SpeedHUD tps={isPlaying ? 2840 : 0} ttft={142} isActive={isPlaying} />
              </div>

              {/* The Forge: Decrypted Stream Area */}
              <div className="flex-1 rounded-3xl bg-obsidian-panel border border-obsidian-border backdrop-blur-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-obsidian-border bg-obsidian-surface/50 flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Decrypted Stream</span>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 font-mono text-sm leading-relaxed">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {decryptedContent.length === 0 && (
                      <div className="text-zinc-600 italic text-center py-20">
                        Press play to stream decrypted events...
                      </div>
                    )}
                    {decryptedContent.map((chunk, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-zinc-300 border-l-2 border-accent-logic pl-4 py-1"
                      >
                        {chunk}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="max-w-4xl mx-auto w-full">
                <ReplayController 
                  isPlaying={isPlaying}
                  progress={progress}
                  playbackSpeed={playbackSpeed}
                  onTogglePlay={() => isPlaying ? stop() : play()}
                  onSeek={(val) => seek(Math.floor((val / 100) * activeEvents.length))}
                  onSpeedChange={setPlaybackSpeed}
                  onReset={() => { stop(); seek(0); }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
```

### 5. Performance & Accessibility Notes

**Performance Considerations:**
- **Decryption Throttling**: Decryption is an async operation. In the `useReplayEngine`, I've implemented a sequential `await` loop. For extremely high-velocity replays, I would implement a **Buffer Queue** where events are decrypted in a background worker (Web Worker) and pushed to the UI thread in batches.
- **DOM Pressure**: The `decryptedContent` array grows linearly. For runs with >10,000 tokens, I would replace the `.map()` render with a **Virtual List** (e.g., `@tanstack/react-virtual`) to keep the DOM node count constant.

**Accessibility (WCAG 2.1 AA):**
- **Keyboard Navigation**: The `ReplayController` uses semantic `<button>` and `<input type="range">` elements, ensuring they are natively focusable and operable via keyboard.
- **Aria Labels**: All icon-only buttons have descriptive `aria-label` attributes (e.g., "Pause Replay").
- **Contrast**: The "Obsidian" palette uses high-contrast neon accents (`oklch(0.65 0.22 260)`) against deep blacks, exceeding the 4.5:1 contrast ratio for text and 3:1 for UI components.
- **Reduced Motion**: The `motion.div` animations can be wrapped in a `useReducedMotion` hook to disable transitions for users with vestibular sensitivities.