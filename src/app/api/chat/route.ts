import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { aiRateLimiter, getIP } from '@/lib/ai/rate-limit';
import { getLanguageMandate } from '@/lib/ai/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = getIP(req);
    const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '15', 10);
    
    try {
      await aiRateLimiter.check(limit, ip);
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later or use your own API key in AI Settings.' },
        { status: 429 }
      );
    }

    // 2. Parse Request
    const body = await req.json();
    const { prompt, system, locale } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 3. Ensure API Key exists across common environment variable names
    const apiKey =
      process.env.GOOGLE_AI_STUDIO_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_AI_STUDIO_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server AI API key not configured. Please configure your own API key in AI Settings.' },
        { status: 503 }
      );
    }

    // 4. Incorporate strict language mandate
    const languageMandate = getLanguageMandate(locale || 'en');
    const baseSystem = system || 'You are an expert career counselor and educational strategist for Indian students.';
    const effectiveSystem = baseSystem.includes('LANGUAGE')
      ? baseSystem
      : `${baseSystem}\n\n${languageMandate}`;

    // 5. Generate Response using GoogleGenAI strictly with gemini-3.6-flash
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: effectiveSystem,
        temperature: 0.6,
      }
    });

    return NextResponse.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('AI Chat API Error:', error);
    
    if (error?.message?.includes('quota') || error?.status === 429) {
      return NextResponse.json(
        { error: 'Server AI quota exceeded. Please configure your own API key in AI Settings.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate AI response: ' + String(error?.message || error) },
      { status: 500 }
    );
  }
}
