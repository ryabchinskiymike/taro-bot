
'use client';

import { TarotReading } from '../lib/types';

interface HistoryProps {
  history: TarotReading[];
}

export default function History({ history }: HistoryProps) {
  return (
    <div className="w-full mt-8 pl-4">
      <h3 className="text-amber-500/70 text-xs font-cinzel tracking-[0.2em] mb-3 uppercase">Архив Судьбы</h3>
      <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 pr-4 min-h-[120px]">
        {history.map((item) => (
          <div key={item.timestamp} className="flex-shrink-0 w-20 flex flex-col items-center space-y-2 opacity-70 hover:opacity-100 transition-opacity">
            <div className="w-20 h-28 rounded-lg overflow-hidden border border-amber-900/50 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.cardImageBase64} alt={item.cardName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <span className="text-[10px] text-amber-200/50 font-serif">
              {new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
            </span>
          </div>
        ))}
        
        {history.length === 0 && (
           <div className="flex items-center h-28 w-full">
              <p className="text-sm text-amber-500/50 italic font-serif border-l-2 border-amber-900/30 pl-3">
                Хроники пока молчат...<br/>
                <span className="text-xs opacity-70">Сделай первый шаг.</span>
              </p>
           </div>
        )}
      </div>
    </div>
  );
}
