CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  script TEXT,
  audio_path TEXT,
  video_path TEXT,
  thumbnail_path TEXT,
  youtube_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
