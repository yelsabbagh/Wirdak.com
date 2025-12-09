import React, { useMemo } from 'react';
import { BEAD_THEMES } from '../constants';

interface ObliqueBeadLoopProps {
  count: number;
  themeId: string;
  xRadius?: number;
  yRadius?: number;
  beadSize?: number;
}

export const ObliqueBeadLoop: React.FC<ObliqueBeadLoopProps> = ({ 
  count, 
  themeId,
  xRadius = 190,
  yRadius = 80,
  beadSize = 55
}) => {
  const theme = useMemo(() => BEAD_THEMES.find(t => t.id === themeId) || BEAD_THEMES[0], [themeId]);
  
  // Settings for the "Large Arc" view
  // changed to 34 (even number) so the alternating pattern (even/odd) loops perfectly without a double color clash
  const BEAD_COUNT = 34;
  // Large horizontal radius pushes beads apart and off-screen
  const X_RADIUS = xRadius; 
  // Vertical radius gives the tilt/oblique depth
  const Y_RADIUS = yRadius;  
  const BEAD_SIZE = beadSize;

  // Generate Bead Positions
  const beads = useMemo(() => {
    // Rotation: move the beads along the path based on count
    const angleStep = (2 * Math.PI) / BEAD_COUNT;
    const rotation = count * angleStep;

    return Array.from({ length: BEAD_COUNT }).map((_, i) => {
      // Calculate angle for this bead
      // (i * angleStep) positions them in a circle
      // - rotation moves them along the path
      // + Math.PI/2 to start centered at the "front" (90 degrees)
      const angle = (i * angleStep) - rotation + (Math.PI / 2);

      // Parametric Ellipse (Oblique Projection)
      const x = Math.cos(angle) * X_RADIUS;
      const y = Math.sin(angle) * Y_RADIUS; // -1 (back) to 1 (front) relative to center

      // Depth calculations based on Y-axis projection (sin(angle))
      // sin(angle) = 1 is FRONT, -1 is BACK
      const sinVal = Math.sin(angle);
      
      // Scale: Dramatically larger at front, smaller at back
      const scale = 0.6 + (0.6 * (sinVal + 1) / 2);
      
      // Z-Index: Front beads must overlap back beads
      const zIndex = Math.floor((sinVal + 2) * 100);
      
      // Visibility Logic: "Only a chunk visible"
      // We fade out beads as they move to the back half of the loop
      // sinVal > -0.2 means mostly front-facing beads are visible
      // We map this to opacity 0-1
      let opacity = 0;
      if (sinVal > -0.3) {
        opacity = (sinVal + 0.3) / 1.3; // Normalize range -0.3...1.0 to 0...1
        // Sharpen the curve so it stays solid longer then drops off
        opacity = Math.pow(opacity, 0.5); 
      }

      // Determine color pattern (Alternate)
      const isPrimary = i % 2 === 0;

      return { id: i, x, y, scale, zIndex, opacity, sinVal, isPrimary };
    });
  }, [count]);

  return (
    <div 
      className="relative flex items-center justify-center w-full h-[200px] select-none pointer-events-none perspective-[1000px] overflow-visible"
    >
      {beads.map((bead) => {
        // Determine colors for this bead
        // Primary beads use the main dark color.
        // Secondary beads use the lighter color, with the primary color as the deep shadow/shading for contrast.
        const baseColor = bead.isPrimary ? theme.colors.beadPrimary : theme.colors.beadSecondary;
        const depthColor = bead.isPrimary ? theme.colors.textPrimary : theme.colors.beadPrimary;

        return (
          <div
            key={bead.id}
            className="absolute rounded-full transition-transform duration-300 ease-out will-change-transform"
            style={{
              width: `${BEAD_SIZE}px`,
              height: `${BEAD_SIZE}px`,
              // Center origin
              left: '50%',
              top: '50%',
              marginLeft: `-${BEAD_SIZE/2}px`,
              marginTop: `-${BEAD_SIZE/2}px`,
              
              // Positioning & Depth
              transform: `translate3d(${bead.x}px, ${bead.y}px, 0) scale(${bead.scale})`,
              zIndex: bead.zIndex,
              opacity: bead.opacity,
              
              // "Liquid Glass" Aesthetic - Refined with Alternating Colors
              backgroundColor: baseColor, 
              // Complex gradient for glass reflection
              backgroundImage: `
                radial-gradient(
                  120% 120% at 30% 30%, 
                  rgba(255, 255, 255, 0.95) 0%, 
                  rgba(255, 255, 255, 0.4) 25%, 
                  ${baseColor} 50%, 
                  ${depthColor} 85%,
                  rgba(0, 0, 0, 0.6) 100%
                )
              `,
              // Inner shadow for depth + Drop shadow for 3D lift
              boxShadow: `
                inset -5px -5px 10px rgba(0,0,0,0.3), 
                inset 2px 2px 5px rgba(255,255,255,0.7), 
                0 10px 20px rgba(0,0,0,0.15)
              `,
              // Glassy border
              border: '1px solid rgba(255,255,255,0.4)',
              
              // Backdrop filter removed for performance
              // backdropFilter: 'blur(3px)',
            }}
          >
            {/* Specular Highlight (Strong reflection) */}
            <div className="absolute top-[15%] left-[20%] w-[35%] h-[20%] bg-gradient-to-br from-white to-transparent rounded-full opacity-90 blur-[1px]" />
            
            {/* Bottom Rim Light (Caustic effect) */}
            <div className="absolute bottom-[10%] right-[15%] w-[40%] h-[30%] bg-gradient-to-t from-white/70 to-transparent rounded-full opacity-50 blur-[3px]" />
          </div>
        );
      })}
    </div>
  );
};
