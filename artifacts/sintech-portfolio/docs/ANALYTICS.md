# Analytics configuration

Analytics is optional and is disabled unless both `VITE_ANALYTICS_URL` and `VITE_ANALYTICS_SITE_ID` are set. Choose and configure a provider before setting them. The small client adapter recognizes Plausible or Umami browser globals.

## Events

The event allowlist is maintained in `src/lib/analytics.ts`:

- `cta_click`
- `contact_step_complete`
- `contact_submit_success`
- `whatsapp_click`
- `booking_click`
- `case_study_view`

Contact form events include only the step number or event name. Never add names, email addresses, phone numbers, message text, budgets, timelines, or other personal details to event properties. Review any additional event before shipping it.

Analytics is loaded when the first event is sent, not as a required part of rendering the site. Confirm the selected provider’s consent and privacy requirements before enabling it.
