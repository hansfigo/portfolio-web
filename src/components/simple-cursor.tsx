import React, { useEffect, useState } from 'react';

interface SimpleCursorProps {
  className?: string;
}

const SimpleCursor: React.FC<SimpleCursorProps> = ({ className = '' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select');
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Add event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-100 ${className}`}
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px) scale(${isHovering ? 1.5 : 1})`,
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full mix-blend-difference" />
      </div>

      {/* Cursor ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-40 transition-all duration-200 ${className}`}
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isHovering ? 1.5 : 1})`,
        }}
      >
        <div className="w-8 h-8 border border-white/50 rounded-full mix-blend-difference" />
      </div>
    </>
  );
};

export default SimpleCursor;
