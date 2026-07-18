import 'dotenv/config';
import { connectDatabase, disconnectDatabase } from '@/config/database';
import { ProblemModel } from '@/modules/problems/problem.model';
import { DIFFICULTY } from '@/constants/difficulty';
import { env } from '@/config/env';

const seedProblems = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

**Constraints:**
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.`,
    difficulty: DIFFICULTY.EASY,
    tags: ['Array', 'Hash Table'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isPublic: true },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isPublic: true },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isPublic: true },
    ]
  },
  {
    slug: 'add-two-numbers',
    title: 'Add Two Numbers',
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Example 1:**
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.`,
    difficulty: DIFFICULTY.MEDIUM,
    tags: ['Linked List', 'Math', 'Recursion'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '[2,4,3]\n[5,6,4]', expectedOutput: '[7,0,8]', isPublic: true },
      { input: '[0]\n[0]', expectedOutput: '[0]', isPublic: true },
    ]
  },
  {
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.

**Example 1:**
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.`,
    difficulty: DIFFICULTY.MEDIUM,
    tags: ['Hash Table', 'String', 'Sliding Window'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3', isPublic: true },
      { input: '"bbbbb"', expectedOutput: '1', isPublic: true },
      { input: '"pwwkew"', expectedOutput: '3', isPublic: true },
    ]
  },
  {
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.

**Example 1:**
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.`,
    difficulty: DIFFICULTY.HARD,
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    timeLimit: 2000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '[1,3]\n[2]', expectedOutput: '2.00000', isPublic: true },
      { input: '[1,2]\n[3,4]', expectedOutput: '2.50000', isPublic: true },
    ]
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    description: `Given a string \`s\`, return the longest palindromic substring in \`s\`.

**Example 1:**
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.`,
    difficulty: DIFFICULTY.MEDIUM,
    tags: ['String', 'Dynamic Programming'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '"babad"', expectedOutput: '"bab"', isPublic: true },
      { input: '"cbbd"', expectedOutput: '"bb"', isPublic: true },
    ]
  },
  {
    slug: 'zigzag-conversion',
    title: 'Zigzag Conversion',
    description: `The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this:

P   A   H   N
A P L S I I G
Y   I   R

And then read line by line: "PAHNAPLSIIGYIR".`,
    difficulty: DIFFICULTY.MEDIUM,
    tags: ['String'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '"PAYPALISHIRING"\n3', expectedOutput: '"PAHNAPLSIIGYIR"', isPublic: true },
    ]
  },
  {
    slug: 'reverse-integer',
    title: 'Reverse Integer',
    description: `Given a signed 32-bit integer \`x\`, return \`x\` with its digits reversed. If reversing \`x\` causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.`,
    difficulty: DIFFICULTY.MEDIUM,
    tags: ['Math'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '123', expectedOutput: '321', isPublic: true },
      { input: '-123', expectedOutput: '-321', isPublic: true },
      { input: '120', expectedOutput: '21', isPublic: true },
    ]
  },
  {
    slug: 'string-to-integer-atoi',
    title: 'String to Integer (atoi)',
    description: `Implement the \`myAtoi(string s)\` function, which converts a string to a 32-bit signed integer.`,
    difficulty: DIFFICULTY.MEDIUM,
    tags: ['String'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '"42"', expectedOutput: '42', isPublic: true },
      { input: '"   -042"', expectedOutput: '-42', isPublic: true },
      { input: '"1337c0d3"', expectedOutput: '1337', isPublic: true },
    ]
  },
  {
    slug: 'palindrome-number',
    title: 'Palindrome Number',
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.`,
    difficulty: DIFFICULTY.EASY,
    tags: ['Math'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '121', expectedOutput: 'true', isPublic: true },
      { input: '-121', expectedOutput: 'false', isPublic: true },
      { input: '10', expectedOutput: 'false', isPublic: true },
    ]
  },
  {
    slug: 'regular-expression-matching',
    title: 'Regular Expression Matching',
    description: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
- \`'.'\` Matches any single character.
- \`'*'\` Matches zero or more of the preceding element.`,
    difficulty: DIFFICULTY.HARD,
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    timeLimit: 2000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '"aa"\n"a"', expectedOutput: 'false', isPublic: true },
      { input: '"aa"\n"a*"', expectedOutput: 'true', isPublic: true },
      { input: '"ab"\n".*"', expectedOutput: 'true', isPublic: true },
    ]
  },
  {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.
Find two lines that together with the x-axis form a container, such that the container contains the most water.
Return the maximum amount of water a container can store.`,
    difficulty: DIFFICULTY.MEDIUM,
    tags: ['Array', 'Two Pointers', 'Greedy'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49', isPublic: true },
      { input: '[1,1]', expectedOutput: '1', isPublic: true },
    ]
  },
  {
    slug: 'integer-to-roman',
    title: 'Integer to Roman',
    description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
Given an integer, convert it to a roman numeral.`,
    difficulty: DIFFICULTY.MEDIUM,
    tags: ['Hash Table', 'Math', 'String'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '3749', expectedOutput: '"MMMDCCXLIX"', isPublic: true },
      { input: '58', expectedOutput: '"LVIII"', isPublic: true },
      { input: '1994', expectedOutput: '"MCMXCIV"', isPublic: true },
    ]
  },
  {
    slug: 'roman-to-integer',
    title: 'Roman to Integer',
    description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
Given a roman numeral, convert it to an integer.`,
    difficulty: DIFFICULTY.EASY,
    tags: ['Hash Table', 'Math', 'String'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '"III"', expectedOutput: '3', isPublic: true },
      { input: '"LVIII"', expectedOutput: '58', isPublic: true },
      { input: '"MCMXCIV"', expectedOutput: '1994', isPublic: true },
    ]
  },
  {
    slug: 'longest-common-prefix',
    title: 'Longest Common Prefix',
    description: `Write a function to find the longest common prefix string amongst an array of strings.
If there is no common prefix, return an empty string "".`,
    difficulty: DIFFICULTY.EASY,
    tags: ['String', 'Trie'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '["flower","flow","flight"]', expectedOutput: '"fl"', isPublic: true },
      { input: '["dog","racecar","car"]', expectedOutput: '""', isPublic: true },
    ]
  },
  {
    slug: '3sum',
    title: '3Sum',
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    difficulty: DIFFICULTY.MEDIUM,
    tags: ['Array', 'Two Pointers', 'Sorting'],
    timeLimit: 1000,
    memoryLimit: 256,
    isPublished: true,
    testCases: [
      { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isPublic: true },
      { input: '[0,1,1]', expectedOutput: '[]', isPublic: true },
      { input: '[0,0,0]', expectedOutput: '[[0,0,0]]', isPublic: true },
    ]
  }
];

async function seed() {
  console.log('Starting seed process...');
  
  if (!env.mongodbUri) {
    console.error('MONGODB_URI is required to run seeder.');
    process.exit(1);
  }

  try {
    await connectDatabase();
    console.log('Connected to database.');

    // Clear existing problems
    const result = await ProblemModel.deleteMany({});
    console.log(`Cleared ${result.deletedCount} existing problems.`);

    // Insert new problems
    const inserted = await ProblemModel.insertMany(seedProblems);
    console.log(`Successfully seeded ${inserted.length} problems.`);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await disconnectDatabase();
    console.log('Seed process completed.');
    process.exit(0);
  }
}

seed();
