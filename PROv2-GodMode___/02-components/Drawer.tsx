<thinking>
The user is requesting a highly animated, premium Drawer component using Framer Motion and Tailwind CSS.
The previous attempt was rejected due to:
1. Hallucinating a second request (the "50 pages" part).
2. Missing the `cn` utility, making it not compile-ready.
3. JSX syntax errors (missing closing brackets `>` on tags).
4. Insufficient micro-interactions.

Plan:
1. Focus *only* on the Drawer component.
2. Include the `cn` utility directly in the file or implement it using a simple helper to ensure the code is standalone and compile-ready.
3. Fix all JSX syntax errors.
4. Enhance micro-interactions:
    - Implement a "magnetic" feel or more nuanced hover states.
    - Add an "active" state for selected items.
    - Improve the drag-to-close logic using `useMotionValue` and `useTransform` for a visual "pull-to-dismiss" effect.
    - Add a staggered entrance animation for the content.
    - Ensure accessibility (ARIA roles, keyboard support).
5. Use a professional, dark-themed "premium" aesthetic.
</thinking>

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, ChevronRight, Settings, User, Bell, LogOut, CreditCard, Shield } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind classes.
 * Included here to ensure the component is compile-ready and standalone.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * NavItem Component
 * Implements premium micro-interactions: 
 * - Hover: Subtle X-axis shift and background glow
 * - Tap: Scale compression
 * - Active: Persistent accent border and glow
 */
const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <motion.button
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
        "text-slate-400 hover:text-white",
        isActive 
          ? "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30" 
          : "hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg transition-colors duration-300",
          isActive 
            ? "bg-indigo-500 text-white" 
            : "bg-slate-800 group-hover:bg-indigo-500/20 group-hover:text-indigo-400"
        )}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <ChevronRight 
        size={16} 
        className={cn(
          "transition-all duration-300",
          isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
        )} 
      />
    </motion.button>
  );
};

export const PremiumDrawer: React.FC<DrawerProps> = ({ 
  isOpen, 
  onClose, 
  title = "Account Settings", 
  subtitle = "Manage your preferences and security" 
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Motion values for the "Pull-to-Dismiss" interaction
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 200], [1, 0]);
  const scale = useTransform(x, [0, 200], [1, 0.95]);

  // Handle Escape key for accessibility
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop: Smooth fade and blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              damping: 28, 
              stiffness: 200, 
              mass: 1 
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, opacity, scale }}
            onDragEnd={(_, info) => {
              // If dragged more than 150px to the right, close the drawer
              if (info.offset.x > 150) onClose();
            }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-slate-950 border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header Section */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-slate-950/50">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg font-semibold text-white tracking-tight"
                >
                  {title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs text-slate-500"
                >
                  {subtitle}
                </motion.p>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-white/5 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Staggered Content Entrance */}
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } },
                  hidden: {}
                }}
                className="space-y-6"
              >
                {/* Section 1: General */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 block px-2">
                    General
                  </label>
                  <div className="space-y-2">
                    <NavItem 
                      icon={User} 
                      label="Profile Details" 
                      isActive={activeTab === "profile"} 
                      onClick={() => setActiveTab("profile")} 
                    />
                    <NavItem 
                      icon={Bell} 
                      label="Notifications" 
                      isActive={activeTab === "notifications"} 
                      onClick={() => setActiveTab("notifications")} 
                    />
                    <NavItem 
                      icon={Settings} 
                      label="Preferences" 
                      isActive={activeTab === "settings"} 
                      onClick={() => setActiveTab("settings")} 
                    />
                  </div>
                </motion.div>

                {/* Section 2: Security & Billing */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 block px-2">
                    Security & Billing
                  </label>
                  <div className="space-y-2">
                    <NavItem 
                      icon={Shield} 
                      label="Privacy & Security" 
                      isActive={activeTab === "security"} 
                      onClick={() => setActiveTab("security")} 
                    />
                    <NavItem 
                      icon={CreditCard} 
                      label="Payment Methods" 
                      isActive={activeTab === "billing"} 
                      onClick={() => setActiveTab("billing")} 
                    />
                  </div>
                </motion.div>

                {/* Section 3: Danger Zone */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="pt-4">
                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                    <label className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest mb-3 block px-1">
                      Danger Zone
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                    >
                      <LogOut size={18} />
                      Sign Out of all sessions
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Footer: Visual Handle and Versioning */}
            <div className="p-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-medium uppercase tracking-tighter">
                  <span>System v4.2.0</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span>Encrypted Session</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumDrawer;
```