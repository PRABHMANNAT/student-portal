export async function callAI(prompt, systemPrompt, options = {}) {
  const { maxTokens = 2000 } = options;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const resp = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      });

      return { text: resp.content[0].text, source: 'claude' };
    } catch (error) {
      console.warn('Claude failed:', error.message);
    }
  }

  if (process.env.GROQ_API_KEY) {
    try {
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const resp = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens
      });

      return { text: resp.choices[0].message.content, source: 'groq' };
    } catch (error) {
      console.warn('Groq failed:', error.message);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o',
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
