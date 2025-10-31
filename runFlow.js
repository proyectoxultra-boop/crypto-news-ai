import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
import { getCryptoTechNews } from './newsFetcher.js';
import { generateScript } from './generateScript.js';
import { generateAudioEleven } from './generateAudio.js';
import { generateVideoFromImages } from './generateVideo.js';
import { uploadToYouTube } from './youtubeUpload.js';
import { query } from './lib/db.js';

const VIDEO_DIR = process.env.VIDEO_OUTPUT_DIR || './videos';
const IMAGES_DIR = process.env.IMAGES_DIR || './images';
await fs.ensureDir(VIDEO_DIR);
await fs.ensureDir(IMAGES_DIR);

async function saveMeta(meta) {
  const text = `INSERT INTO videos(title, description, script, audio_path, video_path, thumbnail_path, youtube_id, status) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
  const vals = [meta.title, meta.description, meta.script, meta.audio_path, meta.video_path, meta.thumbnail_path, meta.youtube_id, meta.status];
  try {
    await query(text, vals);
  } catch(e) {
    console.warn('DB insert failed', e.message);
  }
}

export async function mainFlow() {
  const articles = await getCryptoTechNews();
  for (const art of articles) {
    try {
      console.log('Processing:', art.title);
      const script = await generateScript(art.title, art.description || art.content || '');
      const base = `news_${Date.now()}`;
      const audioPath = path.join(VIDEO_DIR, `${base}.mp3`);
      const videoPath = path.join(VIDEO_DIR, `${base}.mp4`);
      await generateAudioEleven(script, audioPath);

      // download article image or use default
      const images = [];
      if (art.urlToImage) {
        try {
          const resp = await fetch(art.urlToImage);
          const buf = Buffer.from(await resp.arrayBuffer());
          const imgPath = path.join(IMAGES_DIR, `${base}_1.jpg`);
          await fs.outputFile(imgPath, buf);
          images.push(imgPath);
        } catch(e) {
          console.warn('Image download failed', e.message);
        }
      }
      if (images.length === 0) {
        // ensure default image exists
        const defaultImg = path.join(IMAGES_DIR, 'default.jpg');
        if (!fs.existsSync(defaultImg)) {
          // create a simple placeholder
          const blank = Buffer.alloc(300*300*3, 255);
          await fs.outputFile(defaultImg, blank);
        }
        images.push(defaultImg);
      }

      await generateVideoFromImages(audioPath, images, videoPath);

      const thumb = images[0];
      const { videoId } = await uploadToYouTube(art.title, art.description || '', videoPath, thumb);

      await saveMeta({
        title: art.title,
        description: art.description,
        script,
        audio_path: audioPath,
        video_path: videoPath,
        thumbnail_path: thumb,
        youtube_id: videoId,
        status: 'uploaded'
      });

      console.log('Uploaded:', videoId);
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
}

if (process.argv[2] === '--run') {
  mainFlow().catch(console.error);
}

export default mainFlow;
