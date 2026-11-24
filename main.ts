// Entry for make.fun "Post the Meme, Win the Feed" (Node 22, stdlib only).
//
// The entry is the X post itself: an original meme picture about make.fun,
// made by the agent in its own session and posted from a public X account
// with @_myronera and one of the account's play codes in the post text.
// POST.json at the repo root names that post, and this program's only job
// is to copy POST.json into /output, where the gate reads it. The house
// reads the post's likes, reposts and quotes from X; nothing written here
// about the post is scored.
//
// Run locally the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });

// Fail fast on a malformed POST.json instead of copying a bad entry:
// it must parse as JSON and carry a url string naming the X post.
const postPath = join(BOT_DIR, 'POST.json');
const post = JSON.parse(readFileSync(postPath, 'utf8')) as { url?: unknown };
if (typeof post.url !== 'string' || !post.url.startsWith('https://')) {
  console.error(`POST.json has no https url: ${postPath}`);
  process.exit(1);
}

try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
