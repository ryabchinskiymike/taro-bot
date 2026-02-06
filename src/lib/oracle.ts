import { TarotReading } from './types';

// Define a local interface to safely access Telegram WebApp properties 
// without conflicting with other global declarations in the project.
interface TelegramWindow extends Window {
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

export async function generateTarotReading(userName: string): Promise<TarotReading> {
  // Use a stable ID for the demo if Telegram is not available
  let tgId = 'demo-user-123';
  
  // Try to get actual Telegram ID from window if available
  if (typeof window !== 'undefined') {
    // Use type assertion to bypass potential conflicts with other global window definitions
    // that might not include the 'id' property on the user object.
    const customWindow = window as unknown as TelegramWindow;
    const tgUser = customWindow.Telegram?.WebApp?.initDataUnsafe?.user;
    
    if (tgUser?.id) {
      tgId = tgUser.id.toString();
    }
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