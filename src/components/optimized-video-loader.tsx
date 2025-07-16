import React, { useEffect, useRef, useState } from 'react';
import WarpBackground from './warp-background';

interface OptimizedVideoLoaderProps {
  videoSrc: string;
  className?: string;
  style?: React.CSSProperties;
}

const OptimizedVideoLoader: React.FC<OptimizedVideoLoaderProps> = ({ 
  videoSrc, 
  className = '', 
  style
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('Video can play');
      // Quick transition to reduce lag
      setTimeout(() => {
        setShowVideo(true);
      }, 200);
    };

    const handleError = () => {
      console.log('Video error');
      setIsVideoError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Start loading
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc]);

  return (
    <div className="relative w-full h-full">
      {/* WarpBackground as fallback/loading state */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
          showVideo ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <WarpBackground
          color1="#09090b"
          color2="#27272a"
          color3="#52525b"
          speed={0.3}
          swirl={0.2}
          swirlIterations={6}
          shapeScale={0.15}
        />
      </div>

      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={`${className} transition-opacity duration-300 ease-in-out ${
          showVideo ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          ...style,
          transform: 'translateZ(0)', // Force hardware acceleration
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Error fallback - show WarpBackground permanently */}
      {isVideoError && (
        <div className="absolute inset-0">
          <WarpBackground
            color1="#09090b"
            color2="#27272a"
            color3="#52525b"
            speed={0.3}
            swirl={0.2}
            swirlIterations={6}
            shapeScale={0.15}
          />
        </div>
      )}
    </div>
  );
};

export default OptimizedVideoLoader;
