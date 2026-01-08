/**
 * Seed script for initializing siteContent collection
 * Run: node seedSiteContent.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI is missing in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

const SECTIONS = [
  "about",
  "story",
  "methode",
  "hero",
  "customerFeedback",
  "contact"
];

const LANGUAGES = ["hu", "de", "en"];

// Default placeholder content
function defaultContent(section, lang) {
  return {
    section,
    language: lang,
    title: `${section} title (${lang})`,
    subtitle: `${section} subtitle (${lang})`,
    paragraphs: [
      `Default paragraph 1 for ${section} (${lang})`,
      `Default paragraph 2 for ${section} (${lang})`,
      `Default paragraph 3 for ${section} (${lang})`
    ],
    image: "/uploads/placeholder.jpg"
  };
}

async function seed() {
  try {
    await client.connect();
    const db = client.db("yowayoli");
    const collection = db.collection("siteContent");

    console.log("🌱 Starting siteContent seeding...");

    for (const section of SECTIONS) {
      for (const lang of LANGUAGES) {
        const exists = await collection.findOne({ section, language: lang });

        if (!exists) {
          const content = defaultContent(section, lang);
          await collection.insertOne(content);
          console.log(`✔ Inserted: ${section} (${lang})`);
        } else {
          console.log(`↺ Already exists: ${section} (${lang}) — skipping`);
        }
      }
    }

    console.log("🎉 Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();
