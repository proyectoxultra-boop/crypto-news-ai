import fetch from 'node-fetch';

export async function getCryptoTechNews() {
  const q = encodeURIComponent("cryptocurrency OR crypto OR blockchain OR technology");
  const url = `https://newsapi.org/v2/everything?q=${q}&language=en&pageSize=3&apiKey=${process.env.NEWSAPI_KEY}`;
  const r = await fetch(url);
  const json = await r.json();
  return (json.articles || []).filter(a => a.title && (a.description || a.content)).slice(0,3);
}
