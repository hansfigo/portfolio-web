import React, { useEffect, useRef, useState } from 'react';
import WarpBackground from './warp-background';

interface VideoLoaderProps {
  videoSrc: string;
  className?: string;
  style?: React.CSSProperties;
  onLoadingStateChange?: (isLoading: boolean) => void;
}

const VideoLoader: React.FC<VideoLoaderProps> = ({ 
  videoSrc, 
  className = '', 
  style,
  onLoadingStateChange
}) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timeoutId: NodeJS.Timeout;

    const handleCanPlayThrough = () => {
      console.log('Video can play through');
      setIsVideoReady(true);
      onLoadingStateChange?.(false);
      
      // Smooth transition delay
      timeoutId = setTimeout(() => {
        setShowVideo(true);
      }, 500);
    };

    const handleError = () => {
      console.log('Video error');
      setIsVideoError(true);
      onLoadingStateChange?.(false);
    };

    const handleLoadStart = () => {
      console.log('Video load start');
      onLoadingStateChange?.(true);
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // Start loading
    video.load();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [videoSrc, onLoadingStateChange]);

  return (
    <div className="relative w-full h-full">
      {/* WarpBackground as fallback/loading state */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          showVideo ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <WarpBackground
          color1="#09090b"
          color2="#27272a"
          color3="#52525b"
          speed={0.6}
          swirl={0.5}
          swirlIterations={10}
          shapeScale={0.3}
        />
      </div>

      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`${className} transition-opacity duration-1000 ease-in-out ${
          showVideo ? 'opacity-100' : 'opacity-0'
        }`}
        style={style}
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
            speed={0.6}
            swirl={0.5}
            swirlIterations={10}
            shapeScale={0.3}
          />
        </div>
      )}
    </div>
  );
};

export default VideoLoader;
