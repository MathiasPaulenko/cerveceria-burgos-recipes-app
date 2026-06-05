const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimize() {
  const srcDir = path.join(__dirname, '..', 'public', 'images', 'cocktails');
  const thumbDir = path.join(srcDir, 'thumbs');

  if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp'));
  let totalSaved = 0;

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const thumbPath = path.join(thumbDir, file);

    // Skip if thumbnail is newer than original
    if (fs.existsSync(thumbPath)) {
      const srcStat = fs.statSync(srcPath);
      const thumbStat = fs.statSync(thumbPath);
      if (thumbStat.mtime >= srcStat.mtime) continue;
    }

    await sharp(srcPath)
      .resize(128, 128, { fit: 'cover', position: 'center' })
      .webp({ quality: 80, effort: 4 })
      .toFile(thumbPath);

    const srcSize = fs.statSync(srcPath).size;
    const thumbSize = fs.statSync(thumbPath).size;
    totalSaved += srcSize - thumbSize;
    console.log(`${file}: ${Math.round(srcSize/1024)}KB -> ${Math.round(thumbSize/1024)}KB`);
  }

  console.log(`\nTotal saved: ${Math.round(totalSaved/1024)}KB`);
}

optimize().catch(console.error);
