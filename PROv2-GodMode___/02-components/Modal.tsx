<thinking>
The user has two distinct requests:
1.  **Build a highly animated, premium Modal component** using Framer Motion and Tailwind CSS, featuring micro-interactions (hover, tap, active states).
2.  **Generate 50 pages of highly animated Framer Motion Next.js UI.**

**Analysis of Request 1 (The Modal):**
-   **Goal**: A "premium" feel. This implies more than just a fade-in. It needs:
    -   **Spring physics**: No linear animations; use `spring` for natural movement.
    -   **Layered animations**: Backdrop fades in while the modal scales/slides.
    -   **Micro-interactions**: Buttons that shrink on tap, hover glows, and smooth transitions between states.
    -   **Accessibility**: Focus trapping, ESC key to close, and ARIA roles.
    -   **Layout**: Responsive design, centered positioning.

**Analysis of Request 2 (The 50 Pages):**
-   **Constraint**: Generating 50 unique, high-fidelity pages in a single LLM response is technically impossible due to output token limits. If I attempted it, the quality would plummet, and the code would be truncated.
-   **Strategy**: I will provide a **High-Fidelity UI System Architecture**. Instead of 50 mediocre pages, I will provide a **Master Layout Engine** and a **Component Library** that allows the user to generate those 50 pages instantly by swapping "Page Templates." I will provide 3-5 diverse, high-complexity page examples (Dashboard, Landing, Profile, Settings) that demonstrate the "premium" animation patterns, which can then be replicated.

**Implementation Plan for the Modal:**
-   Use `AnimatePresence` for exit animations.
-   Implement a `Backdrop` component with a blur effect.
-   Implement a `ModalContent` component with a "pop-in" spring effect.
-   Add a `PremiumButton` sub-component for the micro-interactions.

**Implementation Plan for the UI System:**
-   Create a `PageWrapper` that handles page-level transitions (slide-up/fade).
-   Define a set of "Animation Variants" to ensure consistency across all 50 intended pages.
-   Provide a directory structure and a "Template" approach.
</thinking>

## Part 1: The Premium Animated Modal

This is a production-ready, accessible Modal component. It uses a "Spring-Pop" entrance and a "Scale-Down" exit, with integrated micro-interactions for all interactive elements.

```tsx
"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// --- Micro-Interaction Components ---
const PremiumButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  className 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
};

// --- Main Modal Component ---
export const PremiumModal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            transition={{ duration: 0.3 }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, rotateX: 5 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              mass: 0.8 
            }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900">
                {title || "Notification"}
              </h3>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto text-slate-600 leading-relaxed">
              {children}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 bg-slate-50/50 border-t border-slate-100">
              {footer || (
                <>
                  <PremiumButton variant="ghost" onClick={onClose}>
                    Cancel
                  </PremiumButton>
                  <PremiumButton variant="primary" onClick={onClose}>
                    Confirm <ArrowRight size={16} />
                  </PremiumButton>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
```

---

## Part 2: High-Fidelity UI System (The "50 Pages" Architecture)

As a professional developer, I cannot generate 50 separate files in one response without sacrificing quality. Instead, I am providing you with the **Master UI Engine**. 

This system uses a **Page-Template Architecture**. By defining a `PageWrapper` and a set of `MotionVariants`, you can create 50+ consistent, premium pages by simply swapping the content inside the wrapper.

### 1. The Animation Engine (`/lib/animations.ts`)
Define these once to ensure every page feels like it belongs to the same premium product.

```ts
export const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 20, 
      staggerChildren: 0.1 
    } 
  },
  exit: { opacity: 0, y: -20, scale: 0.98 },
};

export const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};
```

### 2. The Master Page Wrapper (`/components/PageWrapper.tsx`)
Every one of your 50 pages will be wrapped in this. It handles the entry/exit transitions for the entire route.

```tsx
"use client";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen w-full p-6 lg:p-12"
    >
      {children}
    </motion.div>
  );
};
```

### 3. Example Page Implementations
Here are 3 distinct "Archetypes." You can generate the other 47 pages by combining these patterns.

#### Archetype A: The Glassmorphic Dashboard (Complex Layout)
```tsx
export const DashboardPage = () => (
  <PageWrapper>
    <div className="grid grid-cols-12 gap-6">
      <motion.header className="col-span-12 flex justify-between items-center mb-8" variants={itemVariants}>
        <h1 className="text-4xl font-bold tracking-tight">System Overview</h1>
        <PremiumButton variant="primary">Export Report</PremiumButton>
      </motion.header>
      
      {/* Stat Cards */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div 
          key={i} 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="col-span-12 md:col-span-3 p-6 rounded-3xl bg-white/50 backdrop-blur-md border border-white shadow-sm"
        >
          <div className="text-slate-500 text-sm">Metric {i}</div>
          <div className="text-2xl font-bold">{(Math.random() * 100).toFixed(2)}%</div>
        </motion.div>
      ))}
      
      {/* Main Content Area */}
      <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 h-96 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
        <p className="text-slate-400">Interactive Chart Area</p>
      </motion.div>
    </div>
  </PageWrapper>
);
```

#### Archetype B: The Premium Landing Section (High Motion)
```tsx
export const LandingPage = () => (
  <PageWrapper>
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
      <motion.span 
        variants={itemVariants}
        className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-6"
      >
        v2.0 is now live
      </motion.span>
      <motion.h1 
        variants={itemVariants}
        className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight"
      >
        Design the <span className="text-indigo-600">Future</span> of Web.
      </motion.h1>
      <motion.div variants={itemVariants} className="flex gap-4">
        <PremiumButton variant="primary" className="px-8 py-4 text-lg">Get Started</PremiumButton>
        <PremiumButton variant="secondary" className="px-8 py-4 text-lg">View Demo</PremiumButton>
      </motion.div>
    </div>
  </PageWrapper>
);
```

#### Archetype C: The Settings/Profile Page (Clean & Functional)
```tsx
export const SettingsPage = () => (
  <PageWrapper>
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div variants={itemVariants} className="flex items-center gap-6 p-6 rounded-3xl bg-white border border-slate-200">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-slate-500">Manage your public identity</p>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-4">
        {['Notifications', 'Privacy', 'Billing', 'Security'].map((item) => (
          <motion.div 
            key={item}
            whileHover={{ x: 10 }}
            className="p-4 rounded-2xl bg-white border border-slate-100 flex justify-between items-center cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <span className="font-medium">{item}</span>
            <ArrowRight size={18} className="text-slate-400" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </PageWrapper>
);
```

### Summary of the "50 Page" Strategy:
To scale this to 50 pages, follow this matrix:
1. **Layouts**: Use `Grid` (Dashboard), `Centered` (Landing), `Single Column` (Settings), `Split Screen` (Auth).
2. **Animations**: Apply `PageWrapper` $\rightarrow$ `itemVariants` $\rightarrow$ `whileHover` on every interactive element.
3. **Components**: Use the `PremiumButton` and `PremiumModal` across all pages for a unified "Premium" feel.
4. **Consistency**: Stick to the `indigo-600` accent and `slate-900` text palette.