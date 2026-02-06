import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GoogleGenAI, Type } from '@google/genai';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tgId, name } = body;

    // Validate Input
    if (!tgId) {
      return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // 1. Find or Create User
    const user = await prisma.user.upsert({
      where: { tgId: tgId.toString() },
      update: { name: name || undefined },
      create: {
        tgId: tgId.toString(),
        name: name || 'Странник',
      },
    });

    // 2. Check Database for Existing Reading (24h Logic)
    // We strictly check if a reading exists for the user for the current date.
    const existingReading = await prisma.reading.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    });

    if (existingReading) {
      return NextResponse.json(existingReading);
    }

    // 3. Generate New Reading (Gemini 1.5 Pro + Imagen)
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const randomCard = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];

    // Parallel execution: Text Generation + Image Generation
    const [imageResult, textResult] = await Promise.allSettled([
      // A. Generate Image
      ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Side profile of a majestic tarot card character representing ${randomCard}. Dark fantasy anime aesthetic, sharp features, ornate gold crown, deep obsidian and gold palette, ethereal glowing eyes, intricate gold filigree frame, vertical layout, masterpiece, 8k resolution.`,
        config: {
          numberOfImages: 1,
          aspectRatio: '3:4',
          outputMimeType: 'image/jpeg'
        }
      }),
      // B. Generate Text Prediction
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
          Ты — Мистический Оракул. Твоя задача — дать глубокое предсказание на день на основе карты Таро: "${randomCard}".
          Пользователя зовут "${user.name}".
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
        `,
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
      })
    ]);

    // Process Image Result (with fallback)
    let imageBase64 = 'https://picsum.photos/300/400?grayscale&blur=2'; 
    if (imageResult.status === 'fulfilled' && imageResult.value.generatedImages?.[0]?.image?.imageBytes) {
      imageBase64 = `data:image/jpeg;base64,${imageResult.value.generatedImages[0].image.imageBytes}`;
    } else {
      console.warn("Image generation failed or quota exceeded", imageResult.status === 'rejected' ? imageResult.reason : 'No data');
    }

    // Process Text Result (with fallback)
    let predictionData = {
      cardName: randomCard,
      horoscope: "Туман скрывает будущее. Прислушайся к тишине.",
      finance: "Береги то, что имеешь.",
      relations: "Истина в глазах смотрящего.",
      advice: "Иди вперед, не оглядываясь."
    };

    if (textResult.status === 'fulfilled' && textResult.value.text) {
      try {
        predictionData = JSON.parse(textResult.value.text);
      } catch (e) {
        console.error("Failed to parse AI JSON", e);
      }
    }

    // 4. Save to Database
    const newReading = await prisma.reading.create({
      data: {
        userId: user.id,
        date: today,
        cardName: predictionData.cardName,
        cardImageBase64: imageBase64,
        horoscope: predictionData.horoscope,
        finance: predictionData.finance,
        relations: predictionData.relations,
        advice: predictionData.advice,
        timestamp: Date.now(),
      },
    });

    return NextResponse.json(newReading);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}