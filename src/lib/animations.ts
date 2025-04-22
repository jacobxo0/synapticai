import { Variants } from 'framer-motion';

export const fadeInOut: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUpDown: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const scaleInOut: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

export const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const transitions = {
  default: { duration: 0.2, ease: "easeOut" },
  smooth: { duration: 0.3, ease: "easeInOut" },
  spring: { type: "spring", stiffness: 300, damping: 30 }
};

export const hoverScale = {
  scale: 1.02,
  transition: transitions.default
};

export const tapScale = {
  scale: 0.98,
  transition: transitions.default
};

export const loadingSpinner = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: transitions.default
};

export const modalAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: transitions.smooth
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: transitions.smooth
};

export const listItemAnimation = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: transitions.default
};

export const buttonHover = {
  scale: 1.02,
  transition: transitions.default
};

export const buttonTap = {
  scale: 0.98,
  transition: transitions.default
};

export const tooltipAnimation = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 5 },
  transition: transitions.default
};

export const notificationAnimation = {
  initial: { opacity: 0, y: 20, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.8 },
  transition: transitions.smooth
};

export const progressBarAnimation = {
  initial: { width: 0 },
  animate: { width: "100%" },
  transition: { duration: 0.5, ease: "easeInOut" }
};

export const skeletonAnimation = {
  initial: { opacity: 0.5 },
  animate: { opacity: 0.8 },
  transition: {
    duration: 1,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }
}; 