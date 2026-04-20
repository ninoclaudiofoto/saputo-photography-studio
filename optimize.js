const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = __dirname;
const HOME_DIR = path.join(ROOT_DIR, 'assets', 'img', 'home');
const HOME_BIO_DIR = path.join(HOME_DIR, 'bio');
const HOME_RECENT_DIR = path.join(HOME_DIR, 'recent-works');
const LOVE_STORIES_DIR = path.join(ROOT_DIR, 'assets', 'img', 'love-stories');
const AUTHENTIC_PORTRAITS_DIR = path.join(ROOT_DIR, 'assets', 'img', 'authentic-portraits');
const PROJECTS_DIR = path.join(ROOT_DIR, 'assets', 'img', 'projects');
const DATA_FILE = path.join(ROOT_DIR, 'config', 'site-data.js');

const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const SUPPORTED_EXTENSIONS = new Set([...SOURCE_EXTENSIONS, '.webp']);

(async function main() {
  try {
    await Promise.all([
      ensureDirectory(HOME_DIR),
      ensureDirectory(HOME_BIO_DIR),
      ensureDirectory(HOME_RECENT_DIR),
      ensureDirectory(LOVE_STORIES_DIR),
      ensureDirectory(AUTHENTIC_PORTRAITS_DIR),
      ensureDirectory(PROJECTS_DIR)
    ]);

    const bioLabel = relativeFromRoot(HOME_BIO_DIR);
    const recentLabel = relativeFromRoot(HOME_RECENT_DIR);

    console.log(`>> Ottimizzazione ${bioLabel}`);
    const bioPhotos = await processFlatDirectory(HOME_BIO_DIR);
    const heroPhoto = bioPhotos[0] || null;
    console.log(`   -> ${bioPhotos.length} file processati in ${bioLabel}.`);

    console.log(`>> Ottimizzazione ${recentLabel}`);
    const recentWorkPhotos = await processFlatDirectory(HOME_RECENT_DIR);
    console.log(`   -> ${recentWorkPhotos.length} file processati in ${recentLabel}.`);

    console.log(`>> Scansione Love Stories`);
    const loveStoriesSections = await buildSections(LOVE_STORIES_DIR);
    
    console.log(`>> Scansione Authentic Portraits`);
    const authenticPortraitsSections = await buildSections(AUTHENTIC_PORTRAITS_DIR);

    console.log(`>> Scansione Projects`);
    const projectsSections = await buildSections(PROJECTS_DIR);

    await updateDataFile({
      bio_photo: heroPhoto,
      home_recent_works: recentWorkPhotos,
      love_stories_sections: loveStoriesSections,
      authentic_portraits_sections: authenticPortraitsSections,
      projects_sections: projectsSections
    });
    console.log(`✅ Completato! site-data.js aggiornato.`);
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

async function buildSections(baseDir) {
  const entries = await safeReadDir(baseDir);
  const categories = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const categoryDir = path.join(baseDir, slug);
    const photoPaths = await processFlatDirectory(categoryDir);

    if (photoPaths.length === 0) continue;

    categories.push({
      slug,
      title: humanize(slug),
      photos: photoPaths
    });
  }

  return categories.sort((a, b) => a.title.localeCompare(b.title, 'it', { sensitivity: 'base' }));
}

async function normalizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) return null;

  if (SOURCE_EXTENSIONS.has(ext)) {
    await clearZoneIdentifier(filePath);

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

async function removeFile(filePath, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await fsp.unlink(filePath);
      return;
    } catch (error) {
      if (error.code === 'ENOENT') return;
      
      if (i === retries - 1) {
        console.warn(`Attenzione: impossibile eliminare ${filePath}. Proseguo lasciando il file originale.`, error.message);
        return;
      }
      
      try {
        await fsp.chmod(filePath, 0o666);
      } catch (e) {}
      
      await delay(500); // attendi 500ms per dare tempo a Windows di sbloccare il file
    }
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

async function clearZoneIdentifier(filePath) {
  if (process.platform !== 'win32') return;
  const zonePath = `${filePath}:Zone.Identifier`;
  try {
    await fsp.unlink(zonePath);
  } catch (error) {
    if (!['ENOENT', 'EINVAL', 'ENOTSUP', 'EPERM'].includes(error.code)) {
      console.warn(`Avviso: impossibile rimuovere Zone.Identifier per ${filePath}.`, error.message);
    }
  }
}

function relativeFromRoot(targetPath) {
  const relative = path.relative(ROOT_DIR, targetPath);
  return relative || '.';
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
