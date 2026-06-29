<thinking>
The user is requesting a highly animated, premium Button component using Framer Motion and Tailwind CSS. 

**Critique Analysis:**
1. **Scope**: I must focus *only* on the Button component. No galleries, no "50 pages" hallucination.
2. **Code Integrity**: 
    - Fix the `cn` utility. I will use the industry-standard `clsx` and `tailwind-merge` pattern.
    - Fix the "Premium Glow" logic. The previous version used CSS variables without the JS to update them. I need a `useMouseMove` or a local `onMouseMove` handler that updates the CSS variables on the element.
3. **Architecture**: Provide a single, compile-ready file that is self-contained.
4. **Typing**: Remove all `any` types. Use strict TypeScript interfaces.

**Implementation Plan:**
- **Component**: `PremiumButton`.
- **States**: Idle, Loading, Success.
- **Animations**: 
    - `whileHover`: Subtle scale and lift.
    - `whileTap`: "Squish" effect.
    - `AnimatePresence`: Smooth transitions between state-based content.
- **The Glow**: Implement a `onMouseMove` handler that calculates the mouse position relative to the button's bounding box and updates `--mouse-x` and `--mouse-y` via `element.style.setProperty`.
- **Styling**: Use a sophisticated color palette (Indigo/Violet) with a subtle border-glow and shadow.
</thinking>

```tsx
"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind CSS classes without conflicts.
 * Standard implementation using clsx and tailwind-merge.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => Promise<void> | void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  disabled?: boolean;
}

export const PremiumButton = ({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
}: PremiumButtonProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Handles the radial glow effect by calculating the mouse position
   * relative to the button's bounding box and updating CSS variables.
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    buttonRef.current.style.setProperty("--mouse-x", `${x}px`);
    buttonRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleAction = async () => {
    if (disabled || status !== "idle") return;

    if (onClick) {
      setStatus("loading");
      try {
        await onClick();
        setStatus("success");
        // Reset to idle after a delay to allow the user to see the success state
        setTimeout(() => setStatus("idle"), 3000);
      } catch (error) {
        console.error("PremiumButton action failed:", error);
        setStatus("idle");
      }
    }
  };

  // Variant mapping for styles
  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20",
    secondary: "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 shadow-zinc-500/20",
    outline: "border-2 border-zinc-200 bg-transparent text-zinc-900 hover:border-indigo-600 hover:text-indigo-600",
  };

  return (
    <motion.button
      ref={buttonRef}
      layout
      onClick={handleAction}
      onMouseMove={handleMouseMove}
      disabled={disabled || status !== "idle"}
      whileHover={status === "idle" ? { scale: 1.03, y: -2 } : {}}
      whileTap={status === "idle" ? { scale: 0.97 } : {}}
      className={cn(
        "relative group overflow-hidden px-6 py-3 rounded-xl font-medium transition-all duration-200",
        "flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed",
        "shadow-lg active:shadow-inner",
        variantStyles[variant],
        className
      )}
    >
      {/* 
        Radial Glow Layer: 
        Uses the CSS variables updated by handleMouseMove.
        The gradient follows the cursor for a "premium" interactive feel.
      */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15) 0%, transparent 60%)`,
        }}
      />

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {children}
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.div>
        )}

        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-emerald-400"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/**
 * Example Usage Component
 */
export default function ButtonDemo() {
  const handleAsyncClick = async () => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-zinc-50 p-4">
      <div className="flex flex-wrap justify-center gap-4">
        <PremiumButton onClick={handleAsyncClick}>
          Get Started
        </PremiumButton>
        
        <PremiumButton variant="secondary" onClick={handleAsyncClick}>
          Learn More
        </PremiumButton>
        
        <PremiumButton variant="outline" onClick={handleAsyncClick}>
          Contact Us
        </PremiumButton>
      </div>
    </div>
  );
}
```