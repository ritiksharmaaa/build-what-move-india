import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { node, input, config } = await request.json();

    // Fallback to server env variables if client doesn't provide them
    const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;
    const endpoint = config?.endpoint || process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
    const model = config?.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'MISSING_API_KEY', 
        message: 'No server API key found. Please provide your own API key.' 
      }, { status: 401 });
    }

    const systemPrompt = `You are an expert Indian career counselor. You are helping a student understand their career map. 
The student is currently at stage: ${input.stage} (Stream: ${input.class12Stream || 'N/A'}, Budget: ${input.budgetBand}).
Explain in simple, encouraging terms why the pathway "${node.nameEn}" is currently marked as "${node.doorStatus}".
Provide:
1. The exact reason (based on their stream/budget/maths constraints).
2. What trade-offs they must make to pursue it.
3. 2-3 concrete next steps.
Format your response in plain text with clear bullet points. Keep it under 200 words.`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Please explain this pathway to me.' }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'PROVIDER_ERROR', 
        message: `AI Provider failed: ${response.statusText}`, 
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    const explanation = data.choices[0]?.message?.content || 'No explanation generated.';

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error in /api/explain:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: String(error) }, { status: 500 });
  }
}
