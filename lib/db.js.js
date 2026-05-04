import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL);

// Auto-create tables on first run
export async function initDB() {
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

// Signup
export async function createUser(email, password) {
  const hashed = await bcrypt.hash(password, 10);
  const [user] = await sql`INSERT INTO users (email, password) VALUES (${email}, ${hashed}) RETURNING id, email`;
  return user;
}

// Login
export async function getUserByEmail(email) {
  const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
  return user;
}

// Save $7 payment
export async function createCampaign(userId, walletAddress, txHash, referrerId = null) {
  const [campaign] = await sql`
    INSERT INTO campaigns (user_id, wallet_address, tx_hash, referrer_id, status)
    VALUES (${userId}, ${walletAddress}, ${txHash}, ${referrerId}, 'active')
    RETURNING *
  `;
  return campaign;
}

// Get user campaigns
export async function getUserCampaigns(userId) {
  return await sql`SELECT * FROM campaigns WHERE user_id = ${userId} ORDER BY created_at DESC`;
}