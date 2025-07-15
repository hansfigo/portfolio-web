import React, { useEffect, useRef, useState } from 'react';
import WarpBackground from './warp-background';

interface VideoWithFallbackProps {
  videoSrc: string;
  className?: string;
  style?: React.CSSProperties;
}

const VideoWithFallback: React.FC<VideoWithFallbackProps> = ({ 
  videoSrc, 
  className = '', 
  style 
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('Video can play');
      setIsVideoLoaded(true);
    };

    const handleError = () => {
      console.log('Video error');
      setIsVideoError(true);
    };

    const handleLoadedData = () => {
      console.log('Video loaded data');
      setIsVideoLoaded(true);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          const progress = (bufferedEnd / duration) * 100;
          setLoadingProgress(progress);
        }
      }
    };

    const handleLoadStart = () => {
      console.log('Video load start');
      setLoadingProgress(0);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadstart', handleLoadStart);

    // Force load
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [videoSrc]);

  return (
    <div className="relative w-full h-full">
      {/* WarpBackground as fallback/loading state */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
        
        {/* Loading overlay with progress */}
        {!isVideoLoaded && !isVideoError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="text-white/60 text-sm mb-2">
              Loading video...
            </div>
            <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/60 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-white/40 text-xs mt-1">
              {Math.round(loadingProgress)}%
            </div>
          </div>
        )}
      </div>

      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`${className} transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={style}
        onLoadedData={() => setIsVideoLoaded(true)}
        onError={() => setIsVideoError(true)}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Error fallback */}
      {isVideoError && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-white/60 text-sm">
            Failed to load video
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoWithFallback;
