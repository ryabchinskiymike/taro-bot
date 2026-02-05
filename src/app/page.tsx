'use client';

import { useEffect, useState, useMemo } from 'react';
import MysticEye from '../components/MysticEye';
import CardReveal from '../components/CardReveal';
import History from '../components/History';
import { generateTarotReading } from '../lib/oracle';
import { TarotReading } from '../lib/types';
import { motion } from 'framer-motion';

// Telegram WebApp Type Definition
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            first_name?: string;
          }
        };
        expand?: () => void;
        ready?: () => void;
      }
    }
  }
}

export default function Home() {
  const [userName, setUserName] = useState("Путник");
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [todayReading, setTodayReading] = useState<TarotReading | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hoursUntilNext, setHoursUntilNext] = useState(24);

  // Load History & User - STRICTLY CLIENT SIDE
  useEffect(() => {
    // 1. Calculate time logic only on client to avoid hydration mismatch
    setHoursUntilNext(24 - new Date().getHours());

    // 2. Telegram Safety Check - wrapped in useEffect
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        const tgName = window.Telegram.WebApp.initDataUnsafe?.user?.first_name;
        if (tgName) setUserName(tgName);
      } catch (e) {
        console.warn('Telegram SDK not available or failed', e);
      }
    }

    // 3. Local Storage
    try {
      const stored = localStorage.getItem('mystic_oracle_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setReadings(parsed);
        const today = new Date().toISOString().split('T')[0];
        const current = parsed.find((r: TarotReading) => r.date === today);
        if (current) setTodayReading(current);
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Compute history (excluding today)
  const historyList = useMemo(() => {
    if (!todayReading) return readings;
    return readings.filter(r => r.date !== todayReading.date);
  }, [readings, todayReading]);

  const handleReveal = async () => {
    setIsLoading(true);
    try {
      // Artificial delay for drama
      await new Promise(r => setTimeout(r, 2000));
      
      const newReading = await generateTarotReading(userName);
      
      setTodayReading(newReading);
      const updatedReadings = [newReading, ...readings];
      setReadings(updatedReadings);
      localStorage.setItem('mystic_oracle_history', JSON.stringify(updatedReadings));
    } catch (error) {
      console.error("Divination failed", error);
      alert("Туман слишком густой... Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-6 px-4 relative overflow-x-hidden z-10 selection:bg-amber-900 selection:text-amber-100">
      
      {/* Header */}
      <header className="w-full flex justify-between items-end mb-10 border-b border-amber-500/20 pb-4 relative">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
        <div className="flex flex-col">
          <span className="text-amber-500/70 text-[10px] font-cinzel tracking-[0.2em] uppercase mb-1">Странник</span>
          <h1 className="text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400 mystic-glow">{userName}</h1>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center space-x-1 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] text-amber-500/80 font-cinzel uppercase tracking-widest">{todayReading?.date || 'СЕГОДНЯ'}</span>
          </div>
          <span className="text-sm text-amber-200/60 font-serif italic">Луна убывает</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-center min-h-[500px] mb-8">
        
        {isLoading ? (
          <MysticEye />
        ) : !todayReading ? (
          /* INITIAL STATE */
          <motion.div 
            className="flex flex-col items-center text-center space-y-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Interactive Card Stack Placeholder */}
            <div className="relative group cursor-pointer" onClick={handleReveal}>
              <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="absolute top-2 left-2 w-48 h-72 border border-amber-900/30 rounded-xl bg-slate-900/40 transform rotate-3"></div>
              <div className="absolute top-1 left-1 w-48 h-72 border border-amber-900/40 rounded-xl bg-slate-900/60 transform -rotate-2"></div>
              
              <div className="relative w-48 h-72 border border-amber-500/30 rounded-xl flex items-center justify-center bg-[#080808] backdrop-blur-sm group-hover:border-amber-500/60 transition-colors shadow-2xl">
                <div className="w-40 h-64 border border-dashed border-amber-500/20 rounded-lg flex items-center justify-center">
                   <span className="text-5xl opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500 text-amber-500">❖</span>
                </div>
              </div>
            </div>
            
            <div className="max-w-xs relative">
              <p className="text-amber-100/70 font-serif text-xl leading-relaxed italic mb-8 drop-shadow-md">
                "Тени шепчут... <br />
                Коснись, чтобы открыть истину."
              </p>
              
              <button onClick={handleReveal}
                      className="relative px-10 py-4 group overflow-hidden bg-transparent border border-amber-500/30 text-amber-200 font-cinzel tracking-[0.2em] text-sm uppercase transition-all duration-300 btn-gold-glow">
                <span className="absolute inset-0 w-full h-full bg-amber-900/20 group-hover:bg-amber-800/30 transition-all"></span>
                <span className="relative z-10 group-hover:text-amber-100 transition-colors">Узнать Судьбу</span>
                
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></span>
                <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></span>
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></span>
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* RESULT STATE */
          <motion.div 
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-10 drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]">
              <CardReveal 
                imageUrl={todayReading.cardImageBase64}
                cardName={todayReading.cardName}
              />
            </div>

            <div className="w-full max-w-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent opacity-50"></div>
              
              <div className="gold-border-gradient p-[1px] rounded-sm bg-gradient-to-br from-amber-900/40 to-black">
                 <div className="bg-[#080808]/95 backdrop-blur-xl p-6 rounded-sm relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 text-9xl text-amber-500/5 rotate-12 pointer-events-none font-serif">❦</div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-cinzel mb-2 gold-text-gradient drop-shadow-sm">{todayReading.cardName}</h2>
                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto mt-2"></div>
                    </div>

                    <div className="space-y-6 font-serif leading-relaxed text-lg text-stone-300">
                      
                      <div className="flex flex-col relative z-10">
                        <div className="flex items-center space-x-2 mb-2">
                           <span className="text-amber-500/70 text-lg">✦</span>
                           <span className="text-amber-500/60 text-xs uppercase tracking-[0.15em] font-cinzel">Суть дня</span>
                        </div>
                        <p className="pl-6 border-l border-amber-900/50">{todayReading.horoscope}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 pt-2">
                        <div className="bg-gradient-to-r from-amber-900/10 to-transparent p-4 border-l-2 border-amber-600/30">
                          <span className="text-amber-400/70 text-[10px] uppercase tracking-widest font-cinzel block mb-1">Финансы</span>
                          <p className="text-base text-amber-100/80">{todayReading.finance}</p>
                        </div>
                        <div className="bg-gradient-to-r from-amber-900/10 to-transparent p-4 border-l-2 border-amber-600/30">
                          <span className="text-amber-400/70 text-[10px] uppercase tracking-widest font-cinzel block mb-1">Отношения</span>
                          <p className="text-base text-amber-100/80">{todayReading.relations}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-amber-500/10 text-center relative">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#080808] px-2 text-amber-500/40 text-xl">❦</span>
                        <p className="italic text-amber-200/90 text-xl font-light">"{todayReading.advice}"</p>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="mt-8 text-center pb-4">
               <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-amber-900/20 border border-amber-500/10">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-900 animate-pulse"></div>
                 <p className="text-[10px] text-amber-500/40 uppercase tracking-widest font-cinzel">Цикл обновится через {hoursUntilNext} ч.</p>
               </div>
            </div>
          </motion.div>
        )}
      </main>

      <History history={historyList} />
    </div>
  );
}