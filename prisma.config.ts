import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  // NOTE: `prisma generate` does not require a real database connection.
  // Vercel runs `npm install` (and our `postinstall`) before you may have
  // DATABASE_URL configured, so avoid hard-failing at config-load time.
  // Runtime DB access still requires `process.env.DATABASE_URL` (see `lib/prisma.ts`).
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/postgres",
  },
});
