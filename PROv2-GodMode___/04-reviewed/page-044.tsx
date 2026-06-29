I apologize for the previous errors. I hallucinated a requirement that was not present, provided non-compiling code, and attempted to provide a generic solution instead of a specific audit.

To perform a professional, pixel-perfect review of **page-044** for 60fps compliance and animation performance, **I need you to provide the source code for that page.**

Without the actual code, any "fix" I provide is a guess. To give you a high-fidelity audit, I will be looking for the following specific performance killers:

### 🔍 My Audit Checklist for page-044
When you provide the code, I will analyze it against these four critical performance vectors:

1.  **Layout Thrashing (The 60fps Killer):**
    *   I will flag any animations targeting `width`, `height`, `top`, `left`, `margin`, or `padding`. These trigger the browser's **Layout** and **Paint** pipelines, causing stuttering (jank).
    *   **The Fix:** I will rewrite these to use `scale`, `translate` (x/y), and `rotate`, which are handled by the **GPU Compositor**.

2.  **React Render Cycles vs. Motion Values:**
    *   I will check if you are driving animations via React state (which triggers a full component re-render every frame).
    *   **The Fix:** I will migrate these to `useMotionValue`, `useSpring`, or `useTransform` to bypass the React render loop entirely.

3.  **Variant Optimization:**
    *   I will review your `variants` objects for inefficient transition settings (e.g., using `duration` on a spring instead of `stiffness` and `damping`).
    *   **The Fix:** I will provide tuned spring constants for a "premium" feel that doesn't overshoot or stutter.

4.  **Composite Layering:**
    *   I will identify complex elements that need `will-change: transform` to promote them to their own GPU layer.

---

### 💡 Preview: The "Jaw-Dropping Glow" Implementation
While I wait for your code, here is the technical specification for the glow effect I will integrate into your page. To ensure it doesn't tank the frame rate, I will use a **layered blur strategy** rather than a single heavy `box-shadow`.

**The Technical Approach:**
*   **Layer 1:** A low-opacity, high-blur radial gradient background.
*   **Layer 2:** An animated `scale` and `opacity` loop to create a "breathing" luminosity.
*   **Layer 3:** `mix-blend-mode: screen` or `plus-lighter` to ensure the glow interacts realistically with your background colors.

**Example of the optimized glow primitive I will use:**
```tsx
// This is a GPU-accelerated glow that won't cause stuttering
const GlowEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1], 
        opacity: [0.4, 0.6, 0.4] 
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/30 blur-[100px] rounded-full"
    />
  </div>
);
```

**Please provide the code for `page-044`, and I will deliver the full, compile-ready, 60fps-optimized rewrite immediately.**