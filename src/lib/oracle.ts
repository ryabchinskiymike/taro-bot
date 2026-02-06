import { TarotReading } from './types';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

export async function generateTarotReading(userName: string): Promise<TarotReading> {
  // Use a stable ID for the demo if Telegram is not available
  let tgId = 'demo-user-123';
  
  // Try to get actual Telegram ID from window if available
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
    tgId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
  }

  const response = await fetch('/api/daily-card', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tgId: tgId,
      name: userName
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch oracle prediction');
  }

  const data = await response.json();
  return data as TarotReading;
}