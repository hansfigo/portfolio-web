import React, { useEffect, useState } from 'react';

const TestCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log('TestCursor mounted!'); // Debug log
    
    const updateCursor = (e: MouseEvent) => {
      console.log('Mouse moved:', e.clientX, e.clientY); // Debug log
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', updateCursor);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-50 bg-red-500 w-4 h-4 rounded-full"
      style={{
        transform: `translate(${position.x - 8}px, ${position.y - 8}px)`,
      }}
    />
  );
};

export default TestCursor;
