import { motion, useMotionValue, useSpring } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface OptimizedCursorProps {
  className?: string;
}

const OptimizedCursor: React.FC<OptimizedCursorProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const rafRef = useRef<number | null>(null);
  
  // Use motion values for better performance
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Optimized spring settings for better performance
  const springConfig = {
    stiffness: 120,
    damping: 20,
    mass: 0.3
  };
  
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Optimized hover detection
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
    setIsHovering(!!isInteractive);
  }, []);

  // Use RAF for smooth cursor updates
  const updateCursor = useCallback((e: MouseEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      if (!isVisible) {
        setIsVisible(true);
      }
    });
  }, [cursorX, cursorY, isVisible]);

  useEffect(() => {
    // Check if touch device first
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    // Browser detection for compatibility
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Optimized hover detection
    const handleMouseOver = useCallback((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
      setIsHovering(!!isInteractive);
    }, []);

    // Handle click animations
    const handleMouseDown = useCallback(() => {
      setIsClicking(true);
    }, []);

    const handleMouseUp = useCallback(() => {
      setIsClicking(false);
    }, []);

    // Add event listeners with passive option for better performance
    document.addEventListener('mousemove', updateCursor, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });

    // Show cursor initially when component mounts
    setIsVisible(true);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [updateCursor, handleMouseOver]);

  // Don't render on touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-50 ${className}`}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
          willChange: 'transform'
        }}
      >
        <motion.div
          className="bg-white rounded-full"
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.8 : 1,
            width: isHovering ? 12 : 8,
            height: isHovering ? 12 : 8,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        />
      </motion.div>

      {/* Cursor ring */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-40 ${className}`}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
          willChange: 'transform'
        }}
      >
        <motion.div
          className="border border-white/40 rounded-full"
          animate={{
            scale: isClicking ? 0.9 : isHovering ? 2.2 : 1,
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
            borderWidth: isHovering ? 2 : 1,
            opacity: isClicking ? 0.6 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        />
      </motion.div>

      {/* Click ripple effect */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-30"
          style={{
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%',
            mixBlendMode: 'difference',
            willChange: 'transform'
          }}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="w-16 h-16 border-2 border-white/60 rounded-full" />
        </motion.div>
      )}
    </>
  );
};

export default OptimizedCursor;
