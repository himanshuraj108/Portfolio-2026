import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis;

let prismaInstance;

if (!globalForPrisma.prisma) {
  const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

prismaInstance = globalForPrisma.prisma;
export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
