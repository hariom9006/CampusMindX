import React from 'react';
import { motion } from 'framer-motion';

/**
 * AIOrb — A glowing multi-color AI neural intelligence sphere.
 * Combines Indigo, Violet, Pink, and Cyan with subtle 3D lighting,
 * rotating rings, and soft breathing auras.
 */
export default function AIOrb({ size = 260, interactive = true, className = "" }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient blur aura */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-60 animate-orb-aura"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(236,72,153,0.3) 40%, rgba(6,182,212,0.2) 70%, transparent 100%)'
        }}
      />

      {/* Rotating outer dash ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full border border-dashed border-indigo-300/40"
        style={{ width: size * 1.15, height: size * 1.15 }}
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#06B6D4]" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_10px_#EC4899]" />
      </motion.div>

      {/* Counter-rotating inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full border border-violet-200/50"
        style={{ width: size * 0.95, height: size * 0.95 }}
      >
        <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366F1]" />
        <span className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]" />
      </motion.div>

      {/* Main 3D Glowing Sphere */}
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          rotate: [0, 8, -6, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="relative rounded-full shadow-[0_20px_50px_rgba(99,102,241,0.35),0_0_40px_rgba(236,72,153,0.25)] overflow-hidden"
        style={{
          width: size * 0.72,
          height: size * 0.72,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 28%, #EC4899 65%, #06B6D4 100%)'
        }}
      >
        {/* Apple-like glossy specularity & internal refraction highlight */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.2) 28%, transparent 65%)'
          }}
        />

        {/* Dynamic mesh swirl inside sphere */}
        <div
          className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay animate-orb-spin"
          style={{
            background: 'conic-gradient(from 0deg, #6366F1, #EC4899, #06B6D4, #10B981, #8B5CF6, #6366F1)'
          }}
        />

        {/* Center core pulse */}
        <div
          className="absolute inset-[20%] rounded-full bg-white/40 blur-md animate-orb-aura"
        />

        {/* Refracted lower rim bounce light */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 70% 85%, rgba(6,182,212,0.6) 0%, transparent 45%)'
          }}
        />
      </motion.div>

      {/* Floating neural spark nodes */}
      <motion.div
        animate={{ y: [-4, 4, -4], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-2 right-8 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366F1]"
      />
      <motion.div
        animate={{ y: [4, -4, 4], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-2 -left-2 w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_12px_#EC4899]"
      />
    </div>
  );
}
