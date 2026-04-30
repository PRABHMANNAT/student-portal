import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-20250514';

export async function generateWithAnthropic({ systemPrompt, userPrompt }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing ANTHROPIC_API_KEY');
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2200,
    system: `${systemPrompt}\nReturn valid JSON only.`,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ]
  });

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}

