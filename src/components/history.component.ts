
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TarotReading } from '../services/oracle.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full mt-8 pl-4">
      <h3 class="text-amber-500/70 text-xs font-cinzel tracking-[0.2em] mb-3 uppercase">Архив Судьбы</h3>
      <div class="flex space-x-4 overflow-x-auto no-scrollbar pb-4 pr-4 min-h-[120px]">
        @for (item of history(); track item.timestamp) {
          <div class="flex-shrink-0 w-20 flex flex-col items-center space-y-2 opacity-70 hover:opacity-100 transition-opacity">
            <div class="w-20 h-28 rounded-lg overflow-hidden border border-amber-900/50 relative">
              <img [src]="item.cardImageBase64" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black/40"></div>
            </div>
            <span class="text-[10px] text-amber-200/50 font-serif">{{ item.date | date:'dd.MM' }}</span>
          </div>
        }
        @if (history().length === 0) {
           <div class="flex items-center h-28 w-full">
              <p class="text-sm text-amber-500/50 italic font-serif border-l-2 border-amber-900/30 pl-3">
                Хроники пока молчат...<br>
                <span class="text-xs opacity-70">Сделай первый шаг.</span>
              </p>
           </div>
        }
      </div>
    </div>
  `
})
export class HistoryComponent {
  history = input.required<TarotReading[]>();
}
