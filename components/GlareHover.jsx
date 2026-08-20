import { useRef, useState, useCallback } from 'react';

export default function GlareHover({
  glareColor = '#FFD700',
  glareOpacity = 0.8,
  glareAngle = -30,
  glareSize = 400,
  transitionDuration = 300,
  playOnce = false,
  children,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setGlarePosition({ x, y });
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (playOnce) setHasPlayed(true);
  }, [playOnce]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      style={{
        position: 'relative',
        ...style
      }}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Strong Glare Effect */}
      {isHovering && (!playOnce || !hasPlayed) && (
        <>
          {/* Main glare */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 20,
              background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, ${glareColor} 0%, rgba(255,215,0,0.5) 30%, transparent 70%)`,
              opacity: glareOpacity,
              transition: `opacity ${transitionDuration}ms ease`,
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Second layer for intensity */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 21,
              background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, rgba(255,255,255,0.9) 0%, transparent ${glareSize}px)`,
              opacity: 0.5,
              transition: `opacity ${transitionDuration}ms ease`,
            }}
          />
        </>
      )}

      {/* Gold border glow */}
      {isHovering && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 15,
            border: '3px solid #FFD700',
            borderRadius: 'inherit',
            boxShadow: '0 0 40px rgba(255,215,0,0.8), inset 0 0 40px rgba(255,215,0,0.3)',
            transition: `all ${transitionDuration}ms ease`,
          }}
        />
      )}

      {/* Scale effect on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          transform: isHovering ? 'scale(1.05)' : 'scale(1)',
          transition: `transform ${transitionDuration}ms ease`,
        }}
      />
    </div>
  );
}