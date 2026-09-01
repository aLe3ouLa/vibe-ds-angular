---
"@alexandra/design-system": minor
---

Add `ds-alert-banner` with `variant` (`error`/`warning`/`success`/`info`),
a required `message`, an optional dismiss button (`dismissible`,
`dismissLabel`, `dismissed` output), and two named action slots
(`slot="primary-action"`/`slot="secondary-action"`) for projecting
`ds-button` actions. No new design tokens — reuses `ds-tag`'s existing
feedback color pairing.
