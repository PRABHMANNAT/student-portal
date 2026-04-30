import OpenAI from 'openai';

const MODEL = 'gpt-4o';

export async function generateWithOpenAI({ systemPrompt, userPrompt }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.responses.create({
    model: MODEL,
    input: [
      {
        role: 'system',
        content: [{ type: 'input_text', text: `${systemPrompt}\nReturn valid JSON only.` }]
      },
      {
        role: 'user',
        content: [{ type: 'input_text', text: userPrompt }]
      }
    ]
  });

  return response.output_text || '';
}

