import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Don't run neon() at top level - causes build crash
function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set')
  }
  return neon(process.env.DATABASE_URL)
}

export async function initDB() {
  const sql = getSql()
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      wallet_address TEXT NOT NULL,
      tx_hash TEXT UNIQUE,
      amount INTEGER DEFAULT 7000000,
      status TEXT DEFAULT 'pending',
      referrer_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function createUser(email, password) {
  const sql = getSql()
  const hashed = await bcrypt.hash(password, 10);
  const [user] = await sql`INSERT INTO users (email, password) VALUES (${email}, ${hashed}) RETURNING id, email`;
  return user;
}

export async function getUserByEmail(email) {
  const sql = getSql()
  const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
  return user;
}

export async function createCampaign(userId, walletAddress, txHash, referrerId = null) {
  const sql = getSql()
  const [campaign] = await sql`
    INSERT INTO campaigns (user_id, wallet_address, tx_hash, referrer_id, status)
    VALUES (${userId}, ${walletAddress}, ${txHash}, ${referrerId}, 'active')
    RETURNING *
  `;
  return campaign;
}

export async function getUserCampaigns(userId) {
  const sql = getSql()
  return await sql`SELECT * FROM campaigns WHERE user_id = ${userId} ORDER BY created_at DESC`;
}