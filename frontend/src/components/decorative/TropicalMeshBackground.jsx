import React from 'react';

export default function TropicalMeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient Top Sunset Mesh Blur Blob */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-rose-500/15 to-amber-400/10 rounded-full blur-[120px] animate-pulse-slow"></div>

      {/* Ambient Neon Cyan Bottom Blur Blob */}
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-emerald-500/10 to-transparent rounded-full blur-[140px] animate-float"></div>

      {/* Subtle Festival Particle Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e2640_1px,transparent_1px)] [background-size:32px_32px] opacity-25"></div>
    </div>
  );
}
