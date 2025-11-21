import 'dotenv/config'; // tự load .env trước
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    adapter: 'postgresql', // loại DB

    url: process.env.DATABASE_URL,
  },
});
