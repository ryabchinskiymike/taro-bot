
import { Injectable, signal, computed } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

export interface TarotReading {
  date: string; // ISO Date string (YYYY-MM-DD)
  cardName: string;
  cardImageBase64: string;
  horoscope: string;
  finance: string;
  relations: string;
  advice: string;
  timestamp: number;
}

const TAROT_CARDS = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", 
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", 
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", 
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World",
  "Ace of Cups", "Two of Cups", "Three of Cups", "Queen of Cups", "King of Cups",
  "Ace of Swords", "Ten of Swords", "Queen of Swords", "King of Swords",
  "Ace of Pentacles", "Ten of Pentacles", "Queen of Pentacles", "King of Pentacles",
  "Ace of Wands", "Eight of Wands", "Queen of Wands", "King of Wands"
];

@Injectable({
  providedIn: 'root'
})
export class OracleService {
  private readonly STORAGE_KEY = 'mystic_oracle_history';
  private ai: GoogleGenAI;
  
  // Signals
  readings = signal<TarotReading[]>([]);
  
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.loadHistory();
  }

  private loadHistory() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.readings.set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }

  getTodayReading(): TarotReading | undefined {
    const today = new Date().toISOString().split('T')[0];
    return this.readings().find(r => r.date === today);
  }

  async generateDailyReading(userName: string): Promise<TarotReading> {
    const today = new Date().toISOString().split('T')[0];
    const existing = this.getTodayReading();
    
    if (existing) {
      return existing;
    }

    // 1. Pick a random card
    const randomCard = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];

    // 2. Generate Image (Imagen)
    let imageBase64 = '';
    try {
      const imagePrompt = `Side profile of a majestic tarot card character representing ${randomCard}. Dark fantasy anime aesthetic, sharp features, ornate gold crown, deep obsidian and gold palette, ethereal glowing eyes, intricate gold filigree frame, vertical layout, masterpiece, 8k resolution.`;
      
      const imgResponse = await this.ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: '3:4',
          outputMimeType: 'image/jpeg'
        }
      });
      
      if (imgResponse.generatedImages?.[0]?.image?.imageBytes) {
         imageBase64 = `data:image/jpeg;base64,${imgResponse.generatedImages[0].image.imageBytes}`;
      } else {
         throw new Error('No image bytes returned');
      }
    } catch (error: any) {
      // Check for Quota Exceeded (429) or other errors
      if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || error?.message?.includes('429')) {
        console.warn("Imagen Quota Exceeded. Using fallback visualization.");
      } else {
        console.error("Image generation failed:", error);
      }
      // Fallback visualization
      imageBase64 = 'https://picsum.photos/300/400?grayscale&blur=2'; 
    }

    // 3. Generate Text (Gemini Flash)
    const textPrompt = `
      Ты — Мистический Оракул. Твоя задача — дать глубокое предсказание на день на основе карты Таро: "${randomCard}".
      Пользователя зовут "${userName}".
      Контекст: Modern Dark Fantasy.
      Язык: Русский.
      Тон: Загадочный, мудрый, но поддерживающий.
      
      Верни ответ ТОЛЬКО в формате JSON по следующей схеме:
      {
        "cardName": "Название карты на русском",
        "horoscope": "Общее влияние дня (2-3 предложения)",
        "finance": "Совет по финансам (1 предложение)",
        "relations": "Совет по отношениям (1 предложение)",
        "advice": "Финальное мистическое напутствие"
      }
    `;

    // Add retry logic for text generation just in case
    let textResponse;
    try {
      textResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cardName: { type: Type.STRING },
              horoscope: { type: Type.STRING },
              finance: { type: Type.STRING },
              relations: { type: Type.STRING },
              advice: { type: Type.STRING },
            },
            required: ["cardName", "horoscope", "finance", "relations", "advice"]
          }
        }
      });
    } catch (error) {
       console.error("Text generation failed, using static backup", error);
       // Create a mock response to trigger the fallback parser logic below
       textResponse = { text: "" };
    }

    let predictionData;
    try {
      predictionData = JSON.parse(textResponse.text);
    } catch (e) {
      // Fallback if JSON parse fails or API failed
      predictionData = {
        cardName: randomCard,
        horoscope: "Туман скрывает будущее сегодня. Прислушайся к внутреннему голосу и знакам судьбы.",
        finance: "Сохраняй то, что имеешь. Время не для трат.",
        relations: "Искренность откроет любые двери.",
        advice: "Твой путь уникален — иди смело."
      };
    }

    const newReading: TarotReading = {
      date: today,
      timestamp: Date.now(),
      cardImageBase64: imageBase64,
      ...predictionData
    };

    // Update state and storage
    this.readings.update(prev => [newReading, ...prev]);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.readings()));

    return newReading;
  }
}
