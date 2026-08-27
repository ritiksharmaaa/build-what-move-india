import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { aiRateLimiter, getIP } from '@/lib/ai/rate-limit';

export const runtime = 'nodejs'; // LRUCache requires nodejs runtime

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = getIP(req);
    const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10);
    
    try {
      await aiRateLimiter.check(limit, ip);
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later or use your own API key.' },
        { status: 429 }
      );
    }

    // 2. Parse Request
    const body = await req.json();
    const { prompt, system } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 3. Ensure API Key exists
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server AI API key not configured. Please use your own API key.' },
        { status: 503 }
      );
    }

    // 4. Generate Response using Default Server-Side Provider
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: system || 'You are an expert career counselor for Indian students.',
        temperature: 0.7,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('AI Chat API Error:', error);
    
    // Check for quota/billing errors from Google API
    if (error?.message?.includes('quota') || error?.status === 429) {
      return NextResponse.json(
        { error: 'Server AI quota exceeded. Please use your own API key.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
