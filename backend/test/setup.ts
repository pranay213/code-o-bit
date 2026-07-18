import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { env } from '@/config/env';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Ensure we don't accidentally connect to production DB
  if (env.nodeEnv !== 'test') {
    throw new Error('Tests must be run with NODE_ENV=test');
  }

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear all collections between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (collection) {
      await collection.deleteMany({});
    }
  }
});
