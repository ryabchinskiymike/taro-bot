
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface CardRevealProps {
  imageUrl: string;
  cardName: string;
}

export default function CardReveal({ imageUrl, cardName }: CardRevealProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="w-[280px] h-[420px] cursor-pointer group" 
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={clsx(
          "relative w-full h-full duration-[1500ms] transition-transform",
          isFlipped ? "rotate-y-180" : ""
        )}
        style={{ 
          transformStyle: 'preserve-3d', 
          transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        
        {/* Card Back */}
        <div 
          className="absolute w-full h-full rounded-xl overflow-hidden border border-amber-900/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-[#0a0a0a] flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
           {/* Intricate Back Pattern */}
           <div className="absolute inset-2 border border-amber-500/20 rounded-lg"></div>
           <div className="absolute inset-4 border border-amber-500/10 rounded-lg"></div>
           
           {/* Diagonal Grid Background */}
           <div className="absolute inset-0 opacity-10" 
                style={{
                  backgroundImage: 'radial-gradient(#FBBF24 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}>
           </div>

           {/* Central Ornament */}
           <div className="w-32 h-56 border border-amber-500/20 rotate-45 flex items-center justify-center relative bg-black/50 backdrop-blur-sm">
             <div className="w-24 h-44 border border-amber-500/30 flex items-center justify-center">
                <span className="text-5xl text-amber-600/50 filter blur-[1px]">☾</span>
             </div>
           </div>
        </div>

        {/* Card Front */}
        <div 
          className="absolute w-full h-full rounded-xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_60px_rgba(251,191,36,0.15)] bg-black"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Tarot Card" className="w-full h-full object-cover opacity-90 brightness-90 contrast-110" />
          
          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-24"></div>
          
          {/* Card Name Label */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 font-cinzel text-2xl font-bold tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] uppercase">{cardName}</h3>
          </div>
        </div>

      </div>
    </div>
  );
}
