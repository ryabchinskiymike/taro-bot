
'use client';

import { motion } from 'framer-motion';

export default function MysticEye() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* Layer 1: Outer Runes (Slow Clockwise) */}
        <motion.svg 
          className="absolute w-full h-full opacity-30" 
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="50" cy="50" r="48" stroke="#FBBF24" strokeWidth="0.5" strokeDasharray="2 4" fill="none" />
          <path d="M50 2 L54 6 M50 2 L46 6" stroke="#FBBF24" strokeWidth="0.5" />
          <path d="M50 98 L54 94 M50 98 L46 94" stroke="#FBBF24" strokeWidth="0.5" />
          <path d="M2 50 L6 54 M2 50 L6 46" stroke="#FBBF24" strokeWidth="0.5" />
          <path d="M98 50 L94 54 M98 50 L94 46" stroke="#FBBF24" strokeWidth="0.5" />
        </motion.svg>

        {/* Layer 2: Middle Geometric Triangle (Counter Clockwise) */}
        <motion.svg 
          className="absolute w-32 h-32 opacity-50" 
          viewBox="0 0 100 100"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
           <polygon points="50,5 90,85 10,85" stroke="#F59E0B" strokeWidth="0.5" fill="none" />
           <polygon points="50,95 10,15 90,15" stroke="#F59E0B" strokeWidth="0.5" fill="none" />
           <circle cx="50" cy="50" r="30" stroke="#F59E0B" strokeWidth="0.2" fill="none" />
        </motion.svg>

        {/* Layer 3: Inner Pulsing Eye */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
            animate={{ 
              opacity: [0.6, 1, 0.6], 
              scale: [1, 1.05, 1], 
              filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Eye Shape */}
            <path d="M5 50C5 50 25 15 50 15C75 15 95 50 95 50C95 50 75 85 50 85C25 85 5 50 5 50Z" 
                  stroke="#FBBF24" strokeWidth="1.5" fill="rgba(0,0,0,0.8)"/>
            
            {/* Iris Details */}
            <motion.circle 
              cx="50" cy="50" r="20" 
              stroke="#FBBF24" strokeWidth="0.5" strokeDasharray="1 2" 
              className="opacity-70"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ originX: "50%", originY: "50%" }}
            />

            {/* Pupil */}
            <motion.circle 
              cx="50" cy="50" r="8" fill="#FBBF24"
              animate={{ r: [6, 9, 6], fillOpacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.svg>
        </div>
        
        {/* Glow Center */}
        <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-2xl animate-pulse"></div>
      </div>
      
      <div className="mt-6 flex flex-col items-center space-y-2">
         <span className="text-amber-500 font-cinzel text-sm tracking-[0.3em] animate-pulse">РАСКЛАД</span>
         <span className="text-amber-500/40 text-[10px] uppercase tracking-widest">Связь с эфиром...</span>
      </div>
    </div>
  );
}
