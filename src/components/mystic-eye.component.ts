
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-mystic-eye',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center">
      <div class="relative w-48 h-48 flex items-center justify-center">
        
        <!-- Layer 1: Outer Runes (Slow Clockwise) -->
        <svg class="absolute w-full h-full animate-[spin-slow_20s_linear_infinite] opacity-30" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" stroke="#FBBF24" stroke-width="0.5" stroke-dasharray="2 4" fill="none" />
          <path d="M50 2 L54 6 M50 2 L46 6" stroke="#FBBF24" stroke-width="0.5" />
          <path d="M50 98 L54 94 M50 98 L46 94" stroke="#FBBF24" stroke-width="0.5" />
          <path d="M2 50 L6 54 M2 50 L6 46" stroke="#FBBF24" stroke-width="0.5" />
          <path d="M98 50 L94 54 M98 50 L94 46" stroke="#FBBF24" stroke-width="0.5" />
        </svg>

        <!-- Layer 2: Middle Geometric Triangle (Counter Clockwise) -->
        <svg class="absolute w-32 h-32 animate-[spin-reverse-slow_15s_linear_infinite] opacity-50" viewBox="0 0 100 100">
           <polygon points="50,5 90,85 10,85" stroke="#F59E0B" stroke-width="0.5" fill="none" />
           <polygon points="50,95 10,15 90,15" stroke="#F59E0B" stroke-width="0.5" fill="none" />
           <circle cx="50" cy="50" r="30" stroke="#F59E0B" stroke-width="0.2" fill="none" />
        </svg>

        <!-- Layer 3: Inner Pulsing Eye -->
        <div class="relative w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full animate-[mystical-pulse_4s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            <!-- Eye Shape -->
            <path d="M5 50C5 50 25 15 50 15C75 15 95 50 95 50C95 50 75 85 50 85C25 85 5 50 5 50Z" 
                  stroke="#FBBF24" stroke-width="1.5" fill="rgba(0,0,0,0.8)"/>
            
            <!-- Iris Details -->
            <circle cx="50" cy="50" r="20" stroke="#FBBF24" stroke-width="0.5" stroke-dasharray="1 2" class="opacity-70">
               <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
            </circle>

            <!-- Pupil -->
            <circle cx="50" cy="50" r="8" fill="#FBBF24">
              <animate attributeName="r" values="6;9;6" dur="3s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
        
        <!-- Glow Center -->
        <div class="absolute inset-0 bg-amber-500/5 rounded-full blur-2xl animate-pulse"></div>
      </div>
      
      <div class="mt-6 flex flex-col items-center space-y-2">
         <span class="text-amber-500 font-cinzel text-sm tracking-[0.3em] animate-pulse">РАСКЛАД</span>
         <span class="text-amber-500/40 text-[10px] uppercase tracking-widest">Связь с эфиром...</span>
      </div>
    </div>
  `,
  styles: []
})
export class MysticEyeComponent {}
