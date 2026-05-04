import OpenAI from 'openai';

const MODEL = 'gpt-4o-mini';

export async function generateWithOpenAI({ systemPrompt, userPrompt }) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenAI API key');
  }

  const client = new OpenAI({
    apiKey
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
