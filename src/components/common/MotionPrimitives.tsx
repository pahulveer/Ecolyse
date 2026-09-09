/**
 * MotionPrimitives.tsx
 * Reusable Framer Motion building blocks for a consistent 3D motion language
 * across the entire Ecolyse website.
 */
import React from 'react';
import { motion, type Variants, type MotionProps } from 'framer-motion';

// ─────────────────────────────────────────────
// Shared Spring Configs
// (exported as plain objects — keep in same file but note Vite Fast Refresh
//  only fully HMRs React component exports; constants are fine in practice)
// ─────────────────────────────────────────────
export const springPop = { type: 'spring', stiffness: 380, damping: 28 } as const;
export const springSmooth = { type: 'spring', stiffness: 260, damping: 30 } as const;
export const springGentle = { type: 'spring', stiffness: 180, damping: 26 } as const;
export const easeFast = { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as const } as const;
export const easeMedium = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } as const;

// ─────────────────────────────────────────────
// Page / View Variants (3D flip effect)
// ─────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.97,
    rotateX: 3,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { ...springSmooth, opacity: { duration: 0.3 } },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.96,
    rotateX: -3,
    filter: 'blur(3px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// ─────────────────────────────────────────────
// Step Transition Variants (direction-aware)
// ─────────────────────────────────────────────
export const stepVariantsForward: Variants = {
  initial: { opacity: 0, x: 50, scale: 0.97 },
  animate: { opacity: 1, x: 0, scale: 1, transition: springSmooth },
  exit: { opacity: 0, x: -40, scale: 0.97, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const stepVariantsBack: Variants = {
  initial: { opacity: 0, x: -50, scale: 0.97 },
  animate: { opacity: 1, x: 0, scale: 1, transition: springSmooth },
  exit: { opacity: 0, x: 40, scale: 0.97, transition: { duration: 0.18, ease: 'easeIn' } },
};

// ─────────────────────────────────────────────
// FadeUp — staggered entrance for sections
// ─────────────────────────────────────────────
export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: springSmooth },
};

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  viewport?: boolean;
  style?: React.CSSProperties;
}

export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  delay = 0,
  className,
  viewport = false,
  style,
}) => (
  <motion.div
    variants={fadeUpVariants}
    initial="initial"
    animate={viewport ? undefined : 'animate'}
    whileInView={viewport ? 'animate' : undefined}
    viewport={viewport ? { once: true, margin: '-60px' } : undefined}
    transition={{ ...springSmooth, delay }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

// ─────────────────────────────────────────────
// ScaleIn — pop-in for cards and badges
// ─────────────────────────────────────────────
interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  viewport?: boolean;
  style?: React.CSSProperties;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  className,
  viewport = false,
  style,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={viewport ? undefined : { opacity: 1, scale: 1 }}
    whileInView={viewport ? { opacity: 1, scale: 1 } : undefined}
    viewport={viewport ? { once: true, margin: '-40px' } : undefined}
    transition={{ ...springPop, delay }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

// ─────────────────────────────────────────────
// StaggerList — stagger children with container/item pattern
// ─────────────────────────────────────────────
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSmooth,
  },
};

interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerList: React.FC<StaggerListProps> = ({
  children,
  className,
}) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <motion.div variants={staggerItem} className={className}>
    {children}
  </motion.div>
);

// ─────────────────────────────────────────────
// MotionButton — interactive press/hover
// ─────────────────────────────────────────────
interface MotionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  scale?: number;
  tapScale?: number;
}

export const MotionButton: React.FC<MotionButtonProps> = ({
  children,
  scale = 1.03,
  tapScale = 0.95,
  ...rest
}) => (
  <motion.button
    whileHover={{ scale, y: -1 }}
    whileTap={{ scale: tapScale }}
    transition={springPop}
    {...(rest as MotionProps)}
  >
    {children}
  </motion.button>
);

// ─────────────────────────────────────────────
// MotionCard — hover lift + glow
// ─────────────────────────────────────────────
interface MotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  liftY?: number;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  liftY = -4,
  ...rest
}) => (
  <motion.div
    whileHover={{ y: liftY, scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    transition={springSmooth}
    {...(rest as MotionProps)}
  >
    {children}
  </motion.div>
);
