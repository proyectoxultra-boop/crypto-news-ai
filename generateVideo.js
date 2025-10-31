import { execSync } from 'child_process';
import fs from 'fs-extra';

export function generateVideoFromImages(audioFile, imageFiles, outFile) {
  // create ffconcat file
  const tmp = 'ffconcat.txt';
  let content = '';
  for (const img of imageFiles) {
    content += `file '${img}'\n`;
    content += `duration 4\n`;
  }
  content += `file '${imageFiles[imageFiles.length - 1]}'\n`;
  fs.writeFileSync(tmp, content);

  const vtmp = 'video_no_audio.mp4';
  execSync(`ffmpeg -y -f concat -safe 0 -i ${tmp} -vsync vfr -pix_fmt yuv420p ${vtmp}`, { stdio: 'inherit' });
  execSync(`ffmpeg -y -i ${vtmp} -i ${audioFile} -c:v copy -c:a aac -shortest ${outFile}`, { stdio: 'inherit' });

  fs.unlinkSync(tmp);
  fs.unlinkSync(vtmp);
}
