---
name: Zod resolver typing in pnpm workspaces
description: Why React Hook Form resolver types can disagree with the Zod version used by shared API schemas.
---

In this workspace, `@hookform/resolvers` can resolve its bare `zod` type import to a hoisted Zod 4 package while the app and shared API schemas use Zod 3. This causes a compile-time schema mismatch even though the resolver runtime parses the supplied schema through its `parse` or `parseAsync` method.

**Why:** Adding a workspace dependency changed hoisted type resolution and exposed an existing mismatch; the API schema and runtime stayed on Zod 3.

**How to apply:** Keep shared API validation as the source of truth. If this mismatch returns, adapt only the resolver function boundary, avoid a broad Zod migration or `any`, and rerun the workspace typecheck.
