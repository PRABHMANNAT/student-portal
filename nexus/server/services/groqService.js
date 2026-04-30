import Groq from 'groq-sdk';

const MODEL = 'llama3-70b-8192';

export async function generateWithGroq({ systemPrompt, userPrompt }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('Missing GROQ_API_KEY');
  }

  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const response = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    messages: [
      { role: 'system', content: `${systemPrompt}\nReturn valid JSON only.` },
      { role: 'user', content: userPrompt }
    ]
  });

  return response.choices?.[0]?.message?.content || '';
}

