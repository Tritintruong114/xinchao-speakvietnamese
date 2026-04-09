import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * Geometric "Bé Ghế Nhựa" + broken submarine cable — Neo-Brutal vector for offline states.
 */
export function BrokenCableMascot({ size = 200 }: { size?: number }) {
  const h = size * 0.72;
  return (
    <Svg width={size} height={h} viewBox="0 0 200 144">
      {/* cable left */}
      <Path
        d="M4 88 L42 88 L48 78 L54 88 L62 70 L70 88 L76 78 L82 88"
        stroke="#1A1A1A"
        strokeWidth={3}
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <Rect x={2} y={82} width={8} height={12} fill="#FFC62F" stroke="#1A1A1A" strokeWidth={2} />
      {/* spark */}
      <Path d="M88 56 L92 48 L96 56 L104 44 L100 60 L108 64 L96 68 L92 76 L88 68 L80 64 Z" fill="#FF90E8" stroke="#1A1A1A" strokeWidth={2} />
      {/* chair body */}
      <Rect x={112} y={52} width={76} height={56} rx={4} fill="#86EFAC" stroke="#1A1A1A" strokeWidth={3} />
      {/* chair back */}
      <Rect x={124} y={28} width={52} height={36} rx={4} fill="#93C5FD" stroke="#1A1A1A" strokeWidth={3} />
      {/* legs */}
      <Rect x={118} y={108} width={10} height={28} fill="#1A1A1A" />
      <Rect x={172} y={108} width={10} height={28} fill="#1A1A1A" />
      {/* face on chair */}
      <Circle cx={150} cy={70} r={18} fill="#FAFAF8" stroke="#1A1A1A" strokeWidth={2} />
      <Circle cx={143} cy={66} r={3} fill="#1A1A1A" />
      <Circle cx={157} cy={66} r={3} fill="#1A1A1A" />
      <Path d="M142 76 Q150 82 158 76" stroke="#1A1A1A" strokeWidth={2} fill="none" />
      {/* cable right - dangling */}
      <Path
        d="M176 88 L184 102 L192 94 L196 110 L188 118"
        stroke="#1A1A1A"
        strokeWidth={3}
        fill="none"
        strokeLinecap="square"
      />
      <Rect x={184} y={116} width={10} height={14} fill="#C084FC" stroke="#1A1A1A" strokeWidth={2} />
    </Svg>
  );
}
