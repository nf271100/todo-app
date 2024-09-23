import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function testConnection() {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in .env.local');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  } finally {
    await client.close();
  }
}

testConnection();
