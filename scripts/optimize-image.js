import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, '../public/mood-office.jpg');
const outputPath = join(__dirname, '../public/mood-office-optimized.jpg');

sharp(inputPath)
  .resize(1920, 1080, {
    fit: 'cover',
    withoutEnlargement: true
  })
  .jpeg({
    quality: 80,
    progressive: true,
    mozjpeg: true
  })
  .toFile(outputPath)
  .then(info => {
    console.log('Image optimized:', info);
  })
  .catch(err => {
    console.error('Error optimizing image:', err);
  });
