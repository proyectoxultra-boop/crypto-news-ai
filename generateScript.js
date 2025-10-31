import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateScript(title, description) {
  const prompt = `Write a ~90 second YouTube-friendly news script (neutral, clear) for this headline:\nTitle: ${title}\nSummary: ${description}`;
  const res = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500
  });
  return res.choices[0].message.content.trim();
}
