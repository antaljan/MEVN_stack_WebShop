const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { connect, getDb } = require('../db/mongo');

// Upload könyvtár
const uploadDir = path.join(__dirname, '..', 'uploads');

// HTML-ből helyi képek kinyerése
function extractLocalImagesFromHtml(html) {
  if (!html || typeof html !== 'string') return [];

  const results = [];

  // <img src="/uploads/filename.ext">
  const imgTagRegex = /<img[^>]+src=["'](?:\/uploads\/|https?:\/\/[^"']+\/uploads\/)([^"']+)["']/gi;

  // background-image: url('/uploads/filename.ext')
  const bgRegex = /url\(["']?(?:\/uploads\/|https?:\/\/[^"']+\/uploads\/)([^"')]+)["']?\)/gi;

  let match;

  while ((match = imgTagRegex.exec(html)) !== null) {
    results.push(match[1]);
  }

  while ((match = bgRegex.exec(html)) !== null) {
    results.push(match[1]);
  }

  return results;
}

async function cleanupImages() {
  try {
    console.log('🧹 Starting image cleanup...');

    // DB kapcsolat
    await connect();
    const db = getDb();

    // 1. Blogpostok képei
    const blogImages = await db
      .collection('blogposts')
      .distinct('image');

    // 2. SiteContent képei (HTML vagy string mezők)
    const siteContentDocs = await db.collection('siteContent').find({}).toArray();
    const contentImages = [];

    siteContentDocs.forEach(doc => {
      Object.values(doc).forEach(value => {
        if (typeof value === 'string' && value.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
          contentImages.push(value);
        }
      });
    });

    // 3. Newsletters képei (HTML mezők)
    const newsletters = await db.collection('newsletters').find({}).toArray();
    const newsletterImages = [];

    newsletters.forEach(nl => {
      // rawcontent
      newsletterImages.push(...extractLocalImagesFromHtml(nl.rawcontent));

      // structure array
      if (Array.isArray(nl.structure)) {
        nl.structure.forEach(block => {
          if (block.HTML) {
            newsletterImages.push(...extractLocalImagesFromHtml(block.HTML));
          }
        });
      }
    });

    // 4. Összes használt kép
    const usedImages = [
      ...blogImages,
      ...contentImages,
      ...newsletterImages
    ];

    const uniqueUsedImages = [...new Set(usedImages)];

    // 5. Uploads könyvtár tartalma
    const files = fs.readdirSync(uploadDir);

    let deletedCount = 0;

    // 6. Árva képek törlése
    files.forEach(file => {
      if (!uniqueUsedImages.includes(file)) {
        fs.unlinkSync(path.join(uploadDir, file));
        deletedCount++;
      }
    });

    console.log(`🧹 Image cleanup completed. Deleted ${deletedCount} unused files.`);

  } catch (err) {
    console.error('❌ Cleanup error:', err);
  }
}

// CRON: minden nap hajnali 3-kor
cron.schedule('0 3 * * *', cleanupImages);

module.exports = cleanupImages;
