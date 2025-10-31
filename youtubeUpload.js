import { google } from 'googleapis';
import fs from 'fs';

export async function uploadToYouTube(title, description, videoPath, thumbnailPath) {
  const oauth2Client = new google.auth.OAuth2(process.env.YOUTUBE_CLIENT_ID, process.env.YOUTUBE_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const res = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title,
        description,
        tags: ['crypto','technology','news'],
        categoryId: '28'
      },
      status: { privacyStatus: 'public' }
    },
    media: { body: fs.createReadStream(videoPath) }
  });

  const videoId = res.data.id;
  if (thumbnailPath) {
    try {
      await youtube.thumbnails.set({ videoId, media: { body: fs.createReadStream(thumbnailPath) } });
    } catch (e) {
      console.warn('Thumbnail upload failed', e.message);
    }
  }
  return { videoId, res: res.data };
}
