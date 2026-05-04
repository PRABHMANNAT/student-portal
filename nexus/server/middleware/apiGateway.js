export async function callAI(prompt, systemPrompt, options = {}) {
  const { maxTokens = 2000 } = options;

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (apiKey) {
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey });
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens
      });

      return { text: resp.choices[0].message.content, source: 'openai' };
    } catch (error) {
      console.warn('OpenAI failed:', error.message);
    }
  }

  return { text: null, source: 'demo' };
}
