import React, { useEffect, useMemo, useState } from 'react';
import { BEAD_THEMES } from '../constants';

interface RollingBeadIconProps {
  themeId: string;
  size?: number;
}

export const RollingBeadIcon: React.FC<RollingBeadIconProps> = ({ themeId, size = 32 }) => {
  const theme = useMemo(() => BEAD_THEMES.find(t => t.id === themeId) || BEAD_THEMES[0], [themeId]);
  const [offset, setOffset] = useState(0);

  // Animation Loop for bead "rolling" flow
  useEffect(() => {
    let animationFrameId: number;
    const speed = 0.0005; // Very slow, stable speed

    const animate = () => {
      setOffset(prev => (prev + speed) % (Math.PI * 2));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Configuration for Top-Down View
  const BEAD_COUNT = 10;
  // Use a circular radius (equal X and Y) for top-down perspective
  const RADIUS = size * 0.32; 
  const BEAD_SIZE = size * 0.20; 

  const beads = useMemo(() => {
    const angleStep = (2 * Math.PI) / BEAD_COUNT;

    return Array.from({ length: BEAD_COUNT }).map((_, i) => {
      // Current Angle: Index position + moving offset
      const angle = (i * angleStep) + offset;

      // Circular Path (Top-Down) - simple cos/sin
      const x = Math.cos(angle) * RADIUS;
      const y = Math.sin(angle) * RADIUS;
      
      // Uniform scale for top-down view (no depth distortion)
      const scale = 1;

      const isPrimary = i % 2 === 0;

      return { id: i, x, y, scale, isPrimary };
    });
  }, [offset, BEAD_COUNT, RADIUS, size]);

  return (
    <div 
      className="relative flex items-center justify-center pointer-events-none"
      style={{ 
        width: size, 
        height: size,
        animation: 'wave-float 4s ease-in-out infinite' 
      }}
    >
      <style>{`
        @keyframes wave-float {
          0% { transform: rotate(15deg); }
          50% { transform: rotate(65deg); }
          100% { transform: rotate(15deg); }
        }
      `}</style>
      
      {beads.map((bead) => {
        // Base colors
        const baseColor = bead.isPrimary ? theme.colors.beadPrimary : theme.colors.beadSecondary;
        const depthColor = bead.isPrimary ? theme.colors.textPrimary : theme.colors.beadPrimary;
        
        return (
          <div
            key={bead.id}
            className="absolute rounded-full"
            style={{
              width: BEAD_SIZE,
              height: BEAD_SIZE,
              left: '50%',
              top: '50%',
              marginLeft: -BEAD_SIZE / 2,
              marginTop: -BEAD_SIZE / 2,
              
              transform: `translate3d(${bead.x}px, ${bead.y}px, 0) scale(${bead.scale})`,

              // 3D Bead Style (Spherical Look from Top)
              backgroundColor: baseColor,
              backgroundImage: `
                radial-gradient(
                  circle at 35% 35%, 
                  rgba(255, 255, 255, 0.9) 0%, 
                  rgba(255, 255, 255, 0.2) 25%, 
                  ${baseColor} 50%, 
                  ${depthColor} 90%,
                  rgba(0, 0, 0, 0.7) 100%
                )
              `,
              boxShadow: `
                2px 3px 5px rgba(0,0,0,0.2),
                inset -1px -1px 2px rgba(0,0,0,0.2)
              `,
              border: '0.5px solid rgba(255,255,255,0.15)',
            }}
          >
             {/* Glossy Highlight */}
             <div className="absolute top-[15%] left-[20%] w-[35%] h-[25%] bg-white rounded-full opacity-60 blur-[1px]" />
          </div>
        );
      })}
    </div>
  );
};
