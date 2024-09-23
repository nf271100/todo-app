import { MongoClient } from 'mongodb';

// Get the MongoDB connection string from the environment variables
const uri = process.env.MONGODB_URI;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// Check if we're in the production environment
if (process.env.NODE_ENV === 'production') {
  // In production, always create a new MongoClient instance
  client = new MongoClient(uri);
  clientPromise = client.connect();
} else {
  // In development or non-production environments, use a cached client
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export default clientPromise;
