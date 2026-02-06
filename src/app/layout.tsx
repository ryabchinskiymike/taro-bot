import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мистический Оракул",
  description: "Элитный цифровой артефакт для ежедневных предсказаний.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className="antialiased min-h-screen relative bg-[#050505] text-[#e5e5e5]">
        {/* Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.05]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
             }}>
        </div>
        
        {/* Ambient Background Effects */}
        <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[60%] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-[-1]"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-indigo-950/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-[-1]"></div>

        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}