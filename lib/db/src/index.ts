import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : (null as unknown as pg.Pool);

export const db = pool
  ? drizzle(pool, { schema })
  : (new Proxy(
      {},
      {
        get(_target, prop) {
          return () => {
            throw new Error(
              `DATABASE_URL is not set. Database operation '${String(prop)}' requires a configured DATABASE_URL.`,
            );
          };
        },
      },
    ) as unknown as ReturnType<typeof drizzle<typeof schema>>);

export * from "./schema";
