# Contact form operations

## Submission behavior

- `POST /api/contact` validates the generated API schema, requires consent, limits requests to five per hour per client IP, and uses a honeypot field.
- Valid submissions are stored in the `contact_submissions` database table.
- Resend notifications are optional. Configure `RESEND_API_KEY`, a verified `RESEND_FROM_EMAIL`, and `CONTACT_TO_EMAIL`. A delivery error does not discard the saved inquiry.
- The public success message confirms that the inquiry was saved; it does not promise an email response time.

## Authorized review and export

- The read-only `GET /api/admin/contacts` endpoint is disabled unless `ADMIN_TOKEN` is configured. Send it as a bearer token; do not put it in browser code.
- Export a CSV from the configured database with `pnpm --filter @workspace/scripts run export-contacts`.
- Treat exports as sensitive contact data. Store them only in an approved location and delete them when no longer needed.
- A retention period and a self-service deletion process have not been supplied. Confirm both before production launch.

## Production readiness

The contact table was added to the development schema. Apply it to the production database using the supported production migration process before accepting live submissions. Verify production credentials and email delivery separately; development checks do not prove production readiness.
