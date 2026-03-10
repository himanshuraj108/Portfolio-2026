import { defineConfig, env } from 'prisma/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local (Next.js convention)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: env('DATABASE_URL'),
    },
});
