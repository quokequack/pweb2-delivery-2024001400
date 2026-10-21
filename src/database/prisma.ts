import "dotenv/config";
import { isAbsolute, resolve } from "node:path";

import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const configuredUrl = process.env.DATABASE_URL ?? "file:./dev.db";
if (!configuredUrl?.startsWith("file:")) {
    throw new Error("DATABASE_URL deve apontar para um arquivo SQLite (file:...)");
}

const configuredPath = configuredUrl.slice("file:".length);
const dbPath = isAbsolute(configuredPath)
    ? configuredPath
    : resolve(process.cwd(), "prisma", configuredPath);
const databaseUrl = `file:${dbPath}`;

const adapter = new PrismaBetterSqlite3({
    url: databaseUrl,
});

export const prisma = new PrismaClient({
    adapter
});
