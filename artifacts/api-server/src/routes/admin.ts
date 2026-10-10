import { timingSafeEqual } from "node:crypto";
import { desc } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { contactSubmissionsTable, db } from "@workspace/db";

const router: IRouter = Router();

router.get("/admin/contacts", async (req, res) => {
  const token = process.env["ADMIN_TOKEN"];
  if (!token) {
    return res.status(404).json({ message: "Not found." });
  }

  const authorization = req.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const expectedBytes = Buffer.from(token);
  const suppliedBytes = Buffer.from(supplied);
  const authorized =
    suppliedBytes.length === expectedBytes.length &&
    timingSafeEqual(suppliedBytes, expectedBytes);

  if (!authorized) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    const contacts = await db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.createdAt))
      .limit(100);
    return res.json({ contacts });
  } catch {
    req.log.error("Admin contact list could not be loaded.");
    return res.status(500).json({ message: "Contacts could not be loaded." });
  }
});

export default router;
