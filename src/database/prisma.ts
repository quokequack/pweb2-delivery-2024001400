import "dotenv/config";

import { PrismaClient } from "../../generated/prisma/client.js";
import {PrismaBetterSqlite3} from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
    // @ts-ignore
    url: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({
    adapter
})
