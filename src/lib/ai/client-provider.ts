import { getLanguageMandate } from './prompts';

export type AIProviderOptions = {
  provider: 'google' | 'openai';
  apiKey: string;
};

export class FallbackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FallbackError';
  }
}

/**
 * Gets AI response with strict locale language enforcement using gemini-3.6-flash.
 * If user settings exist, uses them client-side directly.
 * If no user settings, hits the Next.js server route (default).
 * If the server route fails (rate limit/quota), throws FallbackError to prompt the user.
 */
export async function getAIResponse(
  prompt: string, 
  system: string = 'You are an expert career counselor for Indian students.',
  userSettings?: AIProviderOptions | null,
  locale: 'en' | 'hi' = 'en'
): Promise<string> {
  // Ensure strict language mandate is always embedded in the system prompt
  const languageMandate = getLanguageMandate(locale);
  const effectiveSystemPrompt = system.includes('LANGUAGE') 
    ? system 
    : `${system}\n\n${languageMandate}`;

  // 1. Client-Side Execution (User's own key)
  if (userSettings && userSettings.apiKey && userSettings.apiKey.trim() !== '') {
    try {
      if (userSettings.provider === 'google') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${userSettings.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: effectiveSystemPrompt }] },
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`Google Gemini 3.6 API Error: ${errData?.error?.message || res.statusText}`);
        }
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
      } else if (userSettings.provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userSettings.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: effectiveSystemPrompt },
              { role: 'user', content: prompt }
            ]
          })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(`OpenAI API Error: ${errData?.error?.message || res.statusText}`);
        }
        const data = await res.json();
        return data.choices[0].message.content;
      }
    } catch (error: any) {
      console.error('Client AI Provider Error:', error);
      throw new Error(`Your ${userSettings.provider} API key failed: ${error?.message || 'Unknown error'}`);
    }
  }

  // 2. Server-Side Execution (Default Google AI Studio Key via /api/chat)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, system: effectiveSystemPrompt, locale }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 429 || res.status === 503) {
        throw new FallbackError(data.error || 'Server quota exceeded.');
      }
      throw new Error(data.error || 'Server AI failed.');
    }

    return data.text;
  } catch (error: any) {
    if (error instanceof FallbackError) {
      throw error;
    }
    console.error('Server AI Error:', error);
    throw new FallbackError('The default AI server is unavailable. Please configure your own API key.');
  }
}
