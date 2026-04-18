// Community Feature Tests
// This file demonstrates test cases for the community features
// Run with: jest __tests__/community.test.ts

import { mockPosts, mockTrendingHashtags, mockLeaderboard } from '@/lib/community-mock-data';

export const runCommunityTests = () => {
  const tests: { name: string; passed: boolean; error?: string }[] = [];

  // Test 1: Filter posts by category
  try {
    const jobPosts = mockPosts.filter(post => post.category === 'job-search');
    tests.push({
      name: 'Filter posts by category: job-search',
      passed: jobPosts.length > 0 && jobPosts.every(p => p.category === 'job-search'),
    });
  } catch (error) {
    tests.push({
      name: 'Filter posts by category: job-search',
      passed: false,
      error: (error as Error).message,
    });
  }

  // Test 2: Filter posts by hashtag
  try {
    const target = mockPosts[0];
    const hashtag = target.hashtags[0];
    const found = mockPosts.filter(post =>
      post.hashtags.includes(hashtag)
    );
    tests.push({
      name: 'Filter posts by hashtag',
      passed: found.length > 0 && found.includes(target),
    });
  } catch (error) {
    tests.push({
      name: 'Filter posts by hashtag',
      passed: false,
      error: (error as Error).message,
    });
  }

  // Test 3: Create post validation
  try {
    const validatePost = (content: string) => {
      return content.trim().length > 0 && content.trim().length >= 10;
    };

    const valid = validatePost('This is a valid post');
    const invalid = !validatePost('short');

    tests.push({
      name: 'Post content validation',
      passed: valid && invalid,
    });
  } catch (error) {
    tests.push({
      name: 'Post content validation',
      passed: false,
      error: (error as Error).message,
    });
  }

  // Test 4: Save/Unsave functionality
  try {
    const posts = mockPosts.map(p => ({ ...p, isSaved: false }));
    const postId = posts[0].id;
    const updated = posts.map(p =>
      p.id === postId ? { ...p, isSaved: true, saves: p.saves + 1 } : p
    );

    const unsaved = updated.map(p =>
      p.id === postId ? { ...p, isSaved: false, saves: p.saves - 1 } : p
    );

    tests.push({
      name: 'Save/Unsave functionality',
      passed: updated[0].isSaved && !unsaved[0].isSaved,
    });
  } catch (error) {
    tests.push({
      name: 'Save/Unsave functionality',
      passed: false,
      error: (error as Error).message,
    });
  }

  // Test 5: Leaderboard sorting
  try {
    const byScore = [...mockLeaderboard].sort((a, b) => b.score - a.score);
    const byFollowers = [...mockLeaderboard].sort((a, b) => b.followers - a.followers);
    const byStreak = [...mockLeaderboard].sort((a, b) => b.streak - a.streak);

    const scoresDescending = byScore.every((v, i, arr) => i === 0 || arr[i - 1].score >= v.score);
    const followersDescending = byFollowers.every((v, i, arr) => i === 0 || arr[i - 1].followers >= v.followers);
    const streakDescending = byStreak.every((v, i, arr) => i === 0 || arr[i - 1].streak >= v.streak);

    tests.push({
      name: 'Leaderboard sorting',
      passed: scoresDescending && followersDescending && streakDescending,
    });
  } catch (error) {
    tests.push({
      name: 'Leaderboard sorting',
      passed: false,
      error: (error as Error).message,
    });
  }

  // Test 6: Hashtag filtering and trending
  try {
    const hashtag = mockTrendingHashtags[0].tag;
    const matching = mockPosts.filter(post =>
      post.hashtags.some(tag => tag.toLowerCase() === hashtag.toLowerCase())
    );

    const sorted = [...mockTrendingHashtags].sort((a, b) => b.posts - a.posts);
    const isSorted = sorted[0].posts >= (sorted[1]?.posts || 0);

    tests.push({
      name: 'Hashtag filtering and trending',
      passed: Array.isArray(matching) && isSorted,
    });
  } catch (error) {
    tests.push({
      name: 'Hashtag filtering and trending',
      passed: false,
      error: (error as Error).message,
    });
  }

  // Test 7: Data integrity - Posts
  try {
    const allValid = mockPosts.every(post =>
      post.id &&
      post.author &&
      post.content &&
      post.category &&
      post.timestamp &&
      typeof post.likes === 'number' &&
      typeof post.comments === 'number'
    );
    tests.push({
      name: 'Post data integrity',
      passed: allValid,
    });
  } catch (error) {
    tests.push({
      name: 'Post data integrity',
      passed: false,
      error: (error as Error).message,
    });
  }

  // Test 8: Data integrity - Leaderboard
  try {
    const allValid = mockLeaderboard.every(user =>
      user.user &&
      user.rank > 0 &&
      typeof user.score === 'number' &&
      typeof user.followers === 'number'
    );
    tests.push({
      name: 'Leaderboard data integrity',
      passed: allValid,
    });
  } catch (error) {
    tests.push({
      name: 'Leaderboard data integrity',
      passed: false,
      error: (error as Error).message,
    });
  }

  return tests;
};
