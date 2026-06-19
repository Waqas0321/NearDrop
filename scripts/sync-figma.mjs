#!/usr/bin/env node
/**
 * Sync design tokens from Figma REST API.
 * Usage: FIGMA_ACCESS_TOKEN=xxx node scripts/sync-figma.mjs
 */
const FILE_KEY = "7hx4AzvQbY2eo4NtJ4UTsb";
const NODE_IDS = [
  "89:123", // Logo
  "0:1", // Document root — fetches page frames when expanded
];

const token = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN;

if (!token) {
  console.error(
    "Missing FIGMA_ACCESS_TOKEN. Get one at https://www.figma.com/developers/api#access-tokens"
  );
  process.exit(1);
}

const ids = process.argv[2] || NODE_IDS.join(",");
const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}&depth=4`;

const res = await fetch(url, {
  headers: { "X-Figma-Token": token },
});

if (!res.ok) {
  console.error(`Figma API error: ${res.status} ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();
console.log(JSON.stringify(data, null, 2));
