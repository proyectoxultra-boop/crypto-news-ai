import fetch from 'node-fetch';
import fs from 'fs-extra';

export async function generateAudioEleven(text, outPath) {
  const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/default', {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: 'alloy', format: 'mp3' })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('ElevenLabs error: ' + txt);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.outputFile(outPath, buf);
}
