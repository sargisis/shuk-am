/**
 * Applies supabase/schema.sql to your Supabase Postgres.
 *
 * Add to .env.local (Dashboard → Project Settings → Database):
 *   SUPABASE_DB_PASSWORD=your-database-password
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

function buildUrls(ref, password) {
  const enc = encodeURIComponent(password);
  const regions = [
    process.env.SUPABASE_DB_REGION,
    "ap-northeast-1",
    "eu-central-1",
    "us-east-1",
  ].filter(Boolean);

  const urls = [process.env.DATABASE_URL];
  const prefixes = ["aws-1", "aws-0"];

  for (const prefix of prefixes) {
    for (const region of regions) {
      urls.push(
        `postgresql://postgres.${ref}:${enc}@${prefix}-${region}.pooler.supabase.com:5432/postgres`,
      );
      urls.push(
        `postgresql://postgres.${ref}:${enc}@${prefix}-${region}.pooler.supabase.com:6543/postgres`,
      );
    }
  }

  return [...new Set(urls.filter(Boolean))];
}

async function tryConnect(urls) {
  let lastErr;
  for (const connectionString of urls) {
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
    try {
      await client.connect();
      return client;
    } catch (err) {
      lastErr = err;
      await client.end().catch(() => {});
    }
  }
  throw lastErr;
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!url || !password) {
    console.error(`
Add database password to .env.local:

  SUPABASE_DB_PASSWORD=...   (Project Settings → Database)

Then: npm run db:setup

Or paste supabase/schema.sql into Supabase SQL Editor manually.
`);
    process.exit(1);
  }

  const ref = url.replace(/^https?:\/\//, "").split(".")[0];
  const sql = readFileSync(join(root, "supabase/schema.sql"), "utf8");

  console.log("Connecting to Supabase Postgres…");
  const client = await tryConnect(buildUrls(ref, password));

  try {
    console.log("Applying schema + seed…");
    await client.query(sql);
    console.log("✓ Database ready. Restart: npm run dev");
  } catch (err) {
    console.error("Failed:", err.message);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

main();
