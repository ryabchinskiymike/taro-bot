
import { Component, input, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-reveal',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="perspective-1000 w-[280px] h-[420px] cursor-pointer group" (click)="flip()">
      <div class="relative w-full h-full duration-[1500ms] transform-style-3d transition-transform cubic-bezier(0.175, 0.885, 0.32, 1.275)"
           [class.rotate-y-180]="isFlipped">
        
        <!-- Card Back -->
        <div class="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border border-amber-900/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-[#0a0a0a] flex items-center justify-center">
           <!-- Intricate Back Pattern (CSS + SVG) -->
           <div class="absolute inset-2 border border-amber-500/20 rounded-lg"></div>
           <div class="absolute inset-4 border border-amber-500/10 rounded-lg"></div>
           
           <!-- Diagonal Grid Background -->
           <div class="absolute inset-0 opacity-10" 
                style="background-image: radial-gradient(#FBBF24 1px, transparent 1px); background-size: 20px 20px;">
           </div>

           <!-- Central Ornament -->
           <div class="w-32 h-56 border border-amber-500/20 rotate-45 flex items-center justify-center relative bg-black/50 backdrop-blur-sm">
             <div class="w-24 h-44 border border-amber-500/30 flex items-center justify-center">
                <span class="text-5xl text-amber-600/50 filter blur-[1px]">☾</span>
             </div>
           </div>
        </div>

        <!-- Card Front -->
        <div class="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_60px_rgba(251,191,36,0.15)] bg-black">
          <img [src]="imageUrl()" alt="Tarot Card" class="w-full h-full object-cover opacity-90 brightness-90 contrast-110" />
          
          <!-- Vignette & Gradient Overlays -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-90"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-24"></div>
          
          <!-- Card Name Label -->
          <div class="absolute bottom-6 left-0 right-0 text-center">
            <h3 class="text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 font-cinzel text-2xl font-bold tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] uppercase">{{ cardName() }}</h3>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .perspective-1000 { perspective: 1000px; }
    .transform-style-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }
    .rotate-y-180 { transform: rotateY(180deg); }
    .cubic-bezier { transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  `]
})
export class CardRevealComponent implements OnInit {
  imageUrl = input.required<string>();
  cardName = input.required<string>();
  
  isFlipped = false;

  flip() {
    // Optionally toggle
  }

  ngOnInit() {
    setTimeout(() => {
      this.isFlipped = true;
    }, 800);
  }
}
