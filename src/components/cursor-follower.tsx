import { motion, useMotionValue, useSpring } from 'motion/react';
import React, { useEffect, useState } from 'react';

interface CursorFollowerProps {
  className?: string;
}

const CursorFollower: React.FC<CursorFollowerProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Use motion values for better performance
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // More responsive spring animation
  const springX = useSpring(cursorX, {
    stiffness: 200,
    damping: 25,
    mass: 0.5
  });
  
  const springY = useSpring(cursorY, {
    stiffness: 200,
    damping: 25,
    mass: 0.5
  });

  useEffect(() => {
    // Check if touch device first
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Check for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
      setIsHovering(!!isInteractive);
      
      // Force hide default cursor on interactive elements
      if (isInteractive) {
        (isInteractive as HTMLElement).style.cursor = 'none';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
      if (isInteractive) {
        (isInteractive as HTMLElement).style.cursor = 'none';
      }
    };

    // Handle click animations
    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Add event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Show cursor initially when component mounts
    setIsVisible(true);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

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
        className={`fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference ${className}`}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
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
            stiffness: 500,
            damping: 30,
          }}
        />
      </motion.div>

      {/* Cursor ring */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-40 mix-blend-difference ${className}`}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
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
          className="fixed top-0 left-0 pointer-events-none z-30 mix-blend-difference"
          style={{
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%',
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

export default CursorFollower;
