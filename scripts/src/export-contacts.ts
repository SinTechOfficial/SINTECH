import { contactSubmissionsTable, db, pool } from "@workspace/db";

function csvCell(value: unknown): string {
  let text =
    value instanceof Date
      ? value.toISOString()
      : value === null || value === undefined
        ? ""
        : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

async function main() {
  const rows = await db
    .select()
    .from(contactSubmissionsTable);
  const columns = [
    "id",
    "name",
    "email",
    "phone",
    "service",
    "budget",
    "timeline",
    "message",
    "status",
    "createdAt",
    "userAgent",
  ] as const;
  process.stdout.write(`${columns.map(csvCell).join(",")}\n`);
  for (const row of rows) {
    process.stdout.write(
      `${columns.map((column) => csvCell(row[column])).join(",")}\n`,
    );
  }
}

main()
  .catch(() => {
    process.stderr.write("Could not export contact submissions.\n");
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
