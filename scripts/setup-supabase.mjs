/**
 * One-time Supabase project setup for NearDrop.
 *
 * Requires ONE of:
 * - SUPABASE_ACCESS_TOKEN (from https://supabase.com/dashboard/account/tokens)
 * - SUPABASE_DB_PASSWORD (database password from project creation)
 *
 * Usage:
 *   npm run setup:supabase
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PROJECT_REF = "yhljiikbaeffqblkymhx";
const MIGRATIONS_DIR = resolve(ROOT, "supabase/migrations");

function loadMigrationSql() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();
  return files
    .map((name) => readFileSync(resolve(MIGRATIONS_DIR, name), "utf8"))
    .join("\n\n");
}

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      if (!line || line.startsWith("#")) continue;
      const i = line.indexOf("=");
      if (i === -1) continue;
      const key = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnvLocal();

const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

async function managementFetch(path, options = {}) {
  const res = await fetch(`https://api.supabase.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    throw new Error(
      `Management API ${path} failed (${res.status}): ${typeof body === "string" ? body : JSON.stringify(body)}`
    );
  }

  return body;
}

async function enableAnonymousAuth() {
  console.log("→ Enabling anonymous sign-ins...");
  await managementFetch(`/projects/${PROJECT_REF}/config/auth`, {
    method: "PATCH",
    body: JSON.stringify({
      external_anonymous_users_enabled: true,
      mailer_autoconfirm: true,
      disable_signup: false,
    }),
  });
  console.log("✓ Anonymous sign-ins enabled");
}

async function runMigrationViaManagementApi() {
  const sql = loadMigrationSql();
  console.log("→ Running database migrations...");
  await managementFetch(`/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    body: JSON.stringify({ query: sql }),
  });
  console.log("✓ Migrations applied");
}

async function runMigrationViaPostgres() {
  const { Client } = await import("pg");
  const client = new Client({
    host: `db.${PROJECT_REF}.supabase.co`,
    port: 5432,
    user: "postgres",
    password: dbPassword,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  const sql = loadMigrationSql();
  console.log("→ Running database migrations via Postgres...");
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
  console.log("✓ Migrations applied");
}

async function verifySetup() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("⚠ Skipping verify — missing NEXT_PUBLIC_* in .env.local");
    return;
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key);

  for (let attempt = 1; attempt <= 5; attempt++) {
    const anon = await supabase.auth.signInAnonymously();
    const tables = await supabase.from("profiles").select("id").limit(1);

    if (!anon.error && !tables.error) {
      console.log("✓ Verification passed (anonymous auth + profiles table)");
      return;
    }

    if (attempt < 5) {
      console.log(`  Waiting for auth config to propagate (attempt ${attempt}/5)...`);
      await new Promise((r) => setTimeout(r, 3000));
    } else {
      throw new Error(
        `Anonymous auth: ${anon.error?.message ?? "unknown"}; profiles: ${tables.error?.message ?? "unknown"}`
      );
    }
  }
}

async function main() {
  console.log(`NearDrop Supabase setup — project ${PROJECT_REF}\n`);

  if (!accessToken && !dbPassword) {
    console.error(`Missing credentials. Add ONE of these to .env.local:

  SUPABASE_ACCESS_TOKEN=...   # https://supabase.com/dashboard/account/tokens
  SUPABASE_DB_PASSWORD=...    # password you set when creating the project

Then run: npm run setup:supabase`);
    process.exit(1);
  }

  try {
    if (accessToken) {
      await enableAnonymousAuth();
      await runMigrationViaManagementApi();
    } else {
      await runMigrationViaPostgres();
      console.log(
        "\n⚠ Enable anonymous sign-ins manually:\n  Dashboard → Authentication → Providers → Anonymous → ON"
      );
    }

    await verifySetup();
    console.log("\n✅ NearDrop Supabase is ready!");
  } catch (err) {
    console.error("\n❌ Setup failed:", err.message ?? err);
    process.exit(1);
  }
}

main();
