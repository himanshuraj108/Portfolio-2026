import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

try {
  const pool = new Pool({ connectionString: 'postgresql://postgres:Rahul%40663456@localhost:5432/portfolio_db' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  console.log("SUCCESS");
} catch (e) {
  console.log(e.message);
}
