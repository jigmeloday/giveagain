import { defineConfig } from "prisma/config";

// Prisma is used here as a tool only: `db pull` reads the real database into prisma/schema.prisma,
// and Prisma Studio browses the data. The SQL files in db/migrations are the source of truth,
// so there is no `migrations` setting on purpose. Never run `migrate`, `db push` or `db update` against this database.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL_UNPOOLED"],
  },
});
