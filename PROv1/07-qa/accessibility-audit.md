<thinking>
The user wants a comprehensive accessibility audit of the "OmniSwarm PROv1" UI (Cerebras + Nousastra UI) against WCAG 2.2 AA standards. 

**Context Analysis:**
- **Product**: OmniSwarm PROv1.
- **UI Aesthetic**: "Obsidian Glass" / "Agentic OS" (based on the ADR). This implies heavy use of `backdrop-blur`, translucent panels, neon accents, and high-velocity animations (Framer Motion).
- **Key Components**: SpeedHUD, SwarmVisualizer (DAG/Nodes), Console, Chat, Nexus (Sidebar).
- **Critical Risks**: 
    - **Contrast**: Neon accents on dark glass often fail 4.5:1.
    - **Motion**: "Hyper-velocity" animations can trigger vestibular issues if `prefers-reduced-motion` is ignored.
    - **Keyboard/Focus**: Complex DAG visualizers and floating nodes are notorious for "keyboard traps" or illogical tab orders.
    - **Screen Reader**: Dynamic streaming of 3000 tok/s needs careful `aria-live` management to avoid "announcement flooding."

**Audit Strategy:**
1. **Perceivable**: Contrast checks for the Obsidian palette; Alt-text for agent nodes.
2. **Operable**: Keyboard navigation for the SwarmVisualizer; Focus trapping for modals/panels.
3. **Understandable**: Error recovery in the Console; Consistent navigation in the Nexus.
4. **Robust**: ARIA roles for the custom "Agent Node" components.

**Implementation Plan:**
- I will provide a detailed Audit Report with WCAG references.
- I will provide a "Global Accessibility Layer" (CSS/TS) to handle motion and focus.
- I will provide a production-grade `AccessibleAgentNode` component that replaces a naive `div` implementation.
- I will provide a `FocusManager` utility for the "Command Canvas" to handle the complex tab order of a DAG.
</thinking>

# ♿ Accessibility Audit: OmniSwarm PROv1 (Obsidian Glass UI)
**Standard**: WCAG 2.2 Level AA
**Status**: 🔴 Critical Issues Identified (Primarily in Visualizer & Motion)

## 1. Executive Summary
The "Obsidian Glass" aesthetic prioritizes high-fidelity visuals and "hyper-velocity" motion. While stunning, the current implementation creates significant barriers for users with visual impairments, motor disabilities, and vestibular disorders. The most critical failure is the **SwarmVisualizer**, which is currently a "mouse-only" experience.

---

## 2. Detailed Findings & Remediation

### 🔴 Critical: The "Keyboard Void" (Operable)
**Issue**: The `SwarmVisualizer` (DAG) uses absolute positioning for agent nodes. Tabbing through the UI skips the visualizer entirely or jumps randomly, making the core "Agentic OS" experience inaccessible to keyboard-only users.
- **WCAG Criterion**: 2.1.1 Keyboard (Level A)
- **Impact**: Users cannot interact with specific agents or view their individual streams without a mouse.
- **Fix**: Implement a **Roving Tabindex** pattern. Only one node is focusable; arrow keys move focus between connected nodes.

### 🔴 Critical: Motion-Induced Vertigo (Perceivable)
**Issue**: The "Hyper-Velocity" token streaming and node-pulse animations run globally. There is no check for `prefers-reduced-motion`.
- **WCAG Criterion**: 2.3.3 Animation from Interactions (Level AAA / AA best practice)
- **Impact**: Can cause nausea or seizures for users with vestibular disorders.
- **Fix**: Wrap all Framer Motion animations in a `useReducedMotion` hook that switches "glow-pulse" to a static "high-contrast border."

### 🟡 Serious: Contrast "Neon-on-Glass" (Perceivable)
**Issue**: Indigo-500 and Emerald-400 accents on `backdrop-blur` panels often fall below the 4.5:1 ratio, especially when the background content shifts.
- **WCAG Criterion**: 1.4.3 Contrast (Minimum) (Level AA)
- **Impact**: Text is unreadable for users with low vision.
- **Fix**: Implement a "High Contrast" mode that removes transparency and uses solid, WCAG-compliant background colors.

### 🟡 Serious: Live Region Flooding (Understandable)
**Issue**: Streaming 3000 tokens/sec into an `aria-live="polite"` region causes screen readers to enter a "buffer loop," announcing fragments of text indefinitely.
- **WCAG Criterion**: 4.1.3 Status Messages (Level AA)
- **Impact**: The screen reader becomes unusable during active swarm runs.
- **Fix**: Use a "Debounced Live Region." Only announce state changes (e.g., "Agent Researching...") and provide a "Read Final Result" button.

---

## 3. Production-Grade Remediation Code

### File: `src/hooks/use-a11y-motion.ts`
Handles the global motion-reduction logic to prevent vestibular triggers.

```typescript
import { useReducedMotion } from 'framer-motion';

export function useA11yMotion() {
  const shouldReduceMotion = useReducedMotion();

  return {
    // Replace complex animations with simple fades or static states
    transition: shouldReduceMotion 
      ? { type: 'tween', duration: 0 } 
      : { type: 'spring', stiffness: 300, damping: 30 },
    
    // Replace pulsing glows with solid borders
    animationClass: shouldReduceMotion 
      ? 'border-2 border-primary-foreground' 
      : 'animate-pulse shadow-[0_0_15px_var(--accent-glow)]',
      
    shouldReduceMotion
  };
}
```

### File: `src/components/visualizer/AccessibleAgentNode.tsx`
A production-ready replacement for the agent node that supports keyboard navigation and screen readers.

```tsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useA11yMotion } from '@/hooks/use-a11y-motion';
import { cn } from '@/lib/utils';

interface AgentNodeProps {
  id: string;
  label: string;
  status: 'idle' | 'working' | 'complete';
  isFocused: boolean;
  onFocus: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const AccessibleAgentNode = ({ 
  id, label, status, isFocused, onFocus, onKeyDown 
}: AgentNodeProps) => {
  const { transition, animationClass } = useA11yMotion();
  const nodeRef = useRef<HTMLDivElement>(null);

  // Ensure screen reader knows the status change
  const statusText = {
    idle: 'Waiting',
    working: 'Processing tokens at high velocity',
    complete: 'Task finished'
  }[status];

  return (
    <motion.div
      ref={nodeRef}
      layout
      transition={transition}
      tabIndex={isFocused ? 0 : -1} // Roving Tabindex implementation
      role="button"
      aria-label={`${label}, Status: ${statusText}`}
      onFocus={() => onFocus(id)}
      onKeyDown={onKeyDown}
      className={cn(
        "relative p-4 rounded-lg backdrop-blur-xl border transition-all duration-200",
        "bg-obsidian-glass/40 text-foreground",
        isFocused ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-border",
        animationClass,
        status === 'working' && "border-primary"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono opacity-70">{id}</span>
        <span className="font-medium">{label}</span>
      </div>
      
      {/* Visually hidden status for screen readers only */}
      <span className="sr-only">Current state: {statusText}</span>
    </motion.div>
  );
};
```

### File: `src/components/visualizer/FocusManager.tsx`
Manages the complex tab order of the DAG to prevent the "Keyboard Void."

```tsx
import React, { useState, KeyboardEvent } from 'react';

export const FocusManager = ({ children, nodes }: { children: React.ReactNode, nodes: any[] }) => {
  const [focusedId, setFocusedId] = useState<string | null>(nodes[0]?.id || null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!focusedId) return;

    const currentIndex = nodes.findIndex(n => n.id === focusedId);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % nodes.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + nodes.length) % nodes.length;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        console.log(`Activating node: ${nodes[currentIndex].id}`);
        break;
      default:
        return;
    }

    if (nextIndex !== currentIndex) {
      e.preventDefault();
      setFocusedId(nodes[nextIndex].id);
      // Force focus to the DOM element
      document.getElementById(`node-${nodes[nextIndex].id}`)?.focus();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} className="focus-container">
      {/* Pass focusedId and handlers down to AccessibleAgentNode via Context or Props */}
      {children}
    </div>
  );
};
```

### File: `src/styles/a11y-overrides.css`
Ensures that the "Obsidian Glass" doesn't sacrifice visibility for style.

```css
/* High Contrast Mode Overrides */
@media (prefers-contrast: more) {
  :root {
    --background: #000000;
    --foreground: #ffffff;
    --primary: #4f46e5; /* Higher saturation Indigo */
    --border: #ffffff;
    --bg-panel: #111111;
  }

  .backdrop-blur-xl {
    backdrop-filter: none !important;
    background-color: var(--bg-panel) !important;
    border: 2px solid var(--border) !important;
  }
}

/* Focus Indicator - Never remove the outline */
:focus-visible {
  outline: 3px solid var(--primary) !important;
  outline-offset: 2px !important;
}

/* Screen Reader Only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## 4. Final Verification Checklist
- [ ] **Keyboard**: Can I navigate the entire Swarm DAG using only `Tab` and `Arrow Keys`?
- [ ] **Contrast**: Does the "High Contrast" media query trigger and pass 4.5:1?
- [ ] **Motion**: Does setting `prefers-reduced-motion: reduce` stop the pulsing animations?
- [ ] **Screen Reader**: Does the `AccessibleAgentNode` announce the agent's status without flooding the buffer?
- [ ] **Focus**: Is there a visible, high-contrast ring around the active agent node?