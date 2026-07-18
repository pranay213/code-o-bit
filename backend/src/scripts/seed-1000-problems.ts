import mongoose from 'mongoose';
import { ProblemModel } from '../modules/problems/problem.model';
import { env } from '../config/env';

const difficulties = ['easy', 'medium', 'hard'];

async function seed() {
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to DB');

  await ProblemModel.deleteMany({});
  console.log('Cleared existing problems');

  const problems = [];
  
  for (let i = 1; i <= 1000; i++) {
    const multiplier = (i % 10) + 1;
    const difficulty = difficulties[i % 3];
    
    problems.push({
      title: `Multiply by ${multiplier} - Problem ${i}`,
      slug: `multiply-by-${multiplier}-problem-${i}`,
      description: `Write a program that reads a single integer from standard input, multiplies it by ${multiplier}, and prints the result to standard output.\n\nExample:\nInput: 5\nOutput: ${5 * multiplier}`,
      difficulty,
      tags: ['Math', 'Basic'],
      timeLimit: 1000,
      memoryLimit: 256,
      isPublished: true,
      testCases: [
        { input: '0', expectedOutput: '0', isPublic: true },
        { input: '1', expectedOutput: `${multiplier}`, isPublic: true },
        { input: '5', expectedOutput: `${5 * multiplier}`, isPublic: true },
        { input: '10', expectedOutput: `${10 * multiplier}`, isPublic: false },
        { input: '-3', expectedOutput: `${-3 * multiplier}`, isPublic: false },
      ]
    });
    
    if (problems.length >= 100) {
      await ProblemModel.insertMany(problems);
      console.log(`Seeded ${i} problems...`);
      problems.length = 0;
    }
  }
  
  console.log('Done seeding 1000 problems!');
  process.exit(0);
}

seed().catch(console.error);
