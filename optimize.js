const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'assets', 'img', 'original');
const outputDir = path.join(__dirname, 'assets', 'img', 'optimized');


if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach(file => {
        if (!file.match(/\.(jpg|jpeg|png)$/i)) return;

        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

        console.log(`Optimizing ${file}...`);

        sharp(inputPath)
            .resize({
                width: 1920,
                withoutEnlargement: true,
                fit: sharp.fit.inside,
            })
            .webp({ quality: 80 })
            .toFile(outputPath)
            .then(info => {
                console.log(`Successfully optimized: ${file} -> size: ${(info.size / 1024).toFixed(2)} KB`);
            })
            .catch(err => {
                console.error(`Error processing ${file}:`, err);
            });
    });
});
