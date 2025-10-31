# Crypto News AI (Vercel) - Prototype
This repo is a minimal, deployable prototype that:
- Fetches crypto & tech news
- Generates short scripts with OpenAI
- Converts scripts to speech with ElevenLabs
- Generates a simple video (images + audio) via ffmpeg (used in runners/workers)
- Uploads videos automatically to YouTube using OAuth refresh token
- Stores metadata in Neon (Postgres)

## Quick start
1. Create repo on GitHub and push this project.
2. Add repository secrets (GitHub) or Vercel Environment Variables:
   - OPENAI_API_KEY
   - ELEVENLABS_API_KEY
   - NEWSAPI_KEY
   - COINGECKO_API (optional)
   - YOUTUBE_CLIENT_ID
   - YOUTUBE_CLIENT_SECRET
   - YOUTUBE_REFRESH_TOKEN
   - DATABASE_URL (Neon Postgres)
   - VIDEO_OUTPUT_DIR (optional, default ./videos)
3. Ensure `images/default.jpg` exists in the repo (placeholder image).
4. The included GitHub Actions workflow will run the backend flow every 3 hours.
5. Use Vercel to deploy the `frontend/` folder for the panel.

## Notes
- Do NOT commit your real .env. Use secrets.
- For ffmpeg processing, GitHub Actions runner includes ffmpeg; for heavier workloads use a dedicated worker (Render/Cloud Run).
