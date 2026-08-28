import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { aiRateLimiter, getIP } from '@/lib/ai/rate-limit';
import { buildNodeExplanationPrompt } from '@/lib/ai/prompts';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = getIP(request);
    const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '15', 10);
    
    try {
      await aiRateLimiter.check(limit, ip);
    } catch {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Server rate limit exceeded. Please configure your own API key.' },
        { status: 429 }
      );
    }

    const { node, input, locale } = await request.json();

    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'MISSING_API_KEY', 
        message: 'No server API key found. Please provide your own API key in AI Settings.' 
      }, { status: 503 });
    }

    const effectiveLocale: 'en' | 'hi' = locale === 'hi' || input?.preferredLanguage === 'hi' ? 'hi' : 'en';
    const { systemInstruction, userPrompt } = buildNodeExplanationPrompt(node, input, effectiveLocale);

    const ai = new GoogleGenAI({ apiKey });
    
    // Strictly generate with gemini-3.6-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      }
    });

    return NextResponse.json({ explanation: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/explain:', error);
    
    if (error?.message?.includes('quota') || error?.status === 429) {
      return NextResponse.json(
        { error: 'QUOTA_EXCEEDED', message: 'Server AI quota exceeded. Please use your own API key in AI Settings.' },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: 'INTERNAL_ERROR', message: String(error?.message || error) }, { status: 500 });
  }
}
