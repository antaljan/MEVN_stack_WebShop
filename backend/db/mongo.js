const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    await client.connect();
    await client.db('yowayoli').command({ ping: 1 });
    console.log('✅ MongoDB successfully connected');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

function getDb() {
  return client.db('yowayoli');
}

module.exports = {
  client,
  connect,
  getDb
};
