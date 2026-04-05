const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = __dirname;
const HOME_DIR = path.join(ROOT_DIR, 'assets', 'img', 'home');
const HOME_BIO_DIR = path.join(HOME_DIR, 'bio');
const HOME_RECENT_DIR = path.join(HOME_DIR, 'recent-works');
const CATEGORIES_DIR = path.join(ROOT_DIR, 'assets', 'img', 'categories');
const DATA_FILE = path.join(ROOT_DIR, 'config', 'site-data.js');

const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const SUPPORTED_EXTENSIONS = new Set([...SOURCE_EXTENSIONS, '.webp']);

(async function main() {
  try {
    await Promise.all([
      ensureDirectory(HOME_DIR),
      ensureDirectory(HOME_BIO_DIR),
      ensureDirectory(HOME_RECENT_DIR),
      ensureDirectory(CATEGORIES_DIR)
    ]);

    console.log('>> Ottimizzazione home/bio');
    const bioPhotos = await processFlatDirectory(HOME_BIO_DIR);
    const heroPhoto = bioPhotos[0] || null;
    console.log(`   -> ${bioPhotos.length} foto trovate per la bio.`);

    console.log('>> Ottimizzazione home/recent-works');
    const recentWorkPhotos = await processFlatDirectory(HOME_RECENT_DIR);
    console.log(`   -> ${recentWorkPhotos.length} foto Recent Works.`);

    console.log('>> Scansione categorie portfolio');
    const portfolioCategories = await buildPortfolioCategories();
    console.log(`   -> ${portfolioCategories.length} categorie aggiornate.`);

    await updateDataFile({
      bio_photo: heroPhoto,
      home_recent_works: recentWorkPhotos,
      portfolio_categories: portfolioCategories
    });
    console.log('✅ Completato! data.js aggiornato con bio, recent works e categorie.');
  } catch (error) {
    console.error('❌ Errore durante l\'ottimizzazione:', error);
    process.exitCode = 1;
  }
})();

async function ensureDirectory(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

async function processFlatDirectory(dirPath) {
  const entries = await safeReadDir(dirPath);
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const fullPath = path.join(dirPath, entry.name);
    const normalized = await normalizeImage(fullPath);
    if (normalized) files.push(toWebPath(normalized));
  }

  return files.sort();
}

async function buildPortfolioCategories() {
  const entries = await safeReadDir(CATEGORIES_DIR);
  const categories = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const categoryDir = path.join(CATEGORIES_DIR, slug);
    const photoPaths = await processFlatDirectory(categoryDir);

    if (photoPaths.length === 0) continue;

    categories.push({
      slug,
      title: humanize(slug),
      cover: photoPaths[0],
      photos: photoPaths
    });
  }

  return categories.sort((a, b) => a.title.localeCompare(b.title, 'it', { sensitivity: 'base' }));
}

async function normalizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) return null;

  if (SOURCE_EXTENSIONS.has(ext)) {
    const outputPath = replaceExtension(filePath, '.webp');
    await sharp(filePath)
      .resize({ width: 1920, withoutEnlargement: true, fit: sharp.fit.inside })
      .webp({ quality: 80 })
      .toFile(outputPath);

    await removeFile(filePath);
    return outputPath;
  }

  return filePath;
}

async function removeFile(filePath) {
  try {
    await fsp.unlink(filePath);
  } catch (error) {
    if (error.code === 'EPERM') {
      await fsp.chmod(filePath, 0o666);
      await fsp.unlink(filePath);
      return;
    }
    if (error.code !== 'ENOENT') throw error;
  }
}

function replaceExtension(filePath, newExt) {
  return filePath.slice(0, -path.extname(filePath).length) + newExt;
}

async function safeReadDir(dirPath) {
  try {
    return await fsp.readdir(dirPath, { withFileTypes: true });
  } catch (error) {
    console.warn(`Attenzione: impossibile leggere ${dirPath}.`, error.message);
    return [];
  }
}

function humanize(slug) {
  return slug
    .split(/[-_]/g)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function toWebPath(absolutePath) {
  const relative = path.relative(ROOT_DIR, absolutePath);
  return relative.split(path.sep).join('/');
}

async function updateDataFile(generatedData) {
  const serialized = [
    'const siteGenerated = ',
    JSON.stringify(generatedData, null, 2),
    ';\n\n',
    'const siteData = Object.assign(\n',
    '  {},\n',
    '  typeof siteContent !== "undefined" ? siteContent : {},\n',
    '  siteGenerated\n',
    ');\n'
  ].join('');

  await fsp.writeFile(DATA_FILE, serialized, 'utf8');
}
