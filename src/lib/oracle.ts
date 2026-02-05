
import { GoogleGenAI, Type } from '@google/genai';
import { TarotReading } from './types';

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

// Note: In a production app, move API calls to a Server Action to protect the Key.
// For this demo, we assume process.env.API_KEY is available or proxied.
const getApiKey = () => process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY || '';

export async function generateTarotReading(userName: string): Promise<TarotReading> {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  // 1. Pick a random card
  const randomCard = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  const today = new Date().toISOString().split('T')[0];

  // 2. Generate Image (Imagen)
  let imageBase64 = '';
  try {
    const imagePrompt = `Side profile of a majestic tarot card character representing ${randomCard}. Dark fantasy anime aesthetic, sharp features, ornate gold crown, deep obsidian and gold palette, ethereal glowing eyes, intricate gold filigree frame, vertical layout, masterpiece, 8k resolution.`;
    
    const imgResponse = await ai.models.generateImages({
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
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || error?.message?.includes('429')) {
      console.warn("Imagen Quota Exceeded. Using fallback visualization.");
    } else {
      console.error("Image generation failed:", error);
    }
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

  let textResponse;
  try {
    textResponse = await ai.models.generateContent({
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
     textResponse = { text: "" };
  }

  let predictionData;
  try {
    predictionData = JSON.parse(textResponse.text || '{}');
    if (!predictionData.cardName) throw new Error("Empty JSON");
  } catch (e) {
    predictionData = {
      cardName: randomCard,
      horoscope: "Туман скрывает будущее сегодня. Прислушайся к внутреннему голосу и знакам судьбы.",
      finance: "Сохраняй то, что имеешь. Время не для трат.",
      relations: "Искренность откроет любые двери.",
      advice: "Твой путь уникален — иди смело."
    };
  }

  return {
    date: today,
    timestamp: Date.now(),
    cardImageBase64: imageBase64,
    ...predictionData
  };
}
