# Decision 005: Alert Banner API

- Status: Accepted
- Date: 2026-09-01
- Owner: Design System Team

## Decision

The public alert banner selector is `ds-alert-banner`, accepted as
proposed in [RFC 004](../rfcs/004-alert-banner.md).

The initial API includes:

- `variant="error"` / `"warning"` / `"success"` / `"info"` — required, no
  default and no `neutral` option
- `message` — required string, not projected content
- `dismissible` (default `false`) with a `dismissLabel` input, matching
  `ds-tag`'s dismiss pattern
- A `dismissed` output — the component signals removal intent, it does
  not remove itself
- Two named content-projection slots for actions,
  `slot="primary-action"` and `slot="secondary-action"`, each expecting a
  `ds-button`. No open-ended actions list.

No new design tokens — reuses `ds-tag`'s existing
`--ds-color-feedback-{error,warning,success,info}` pairing.

## Why

Product guidance for this component was explicit on two points that
directly shaped the API: don't introduce banner-specific colors, and don't
allow more than one action of the same weight in a banner. Reusing
`ds-tag`'s existing feedback tokens satisfies the first directly — no
token-pipeline change needed. The second shaped the actions API: rather
than an open action list a consumer could fill with three same-weight
buttons, the component exposes exactly two named slots
(`primary-action`/`secondary-action`), making the intended usage pattern
the path of least resistance. See RFC 004's Alternatives for the actions
API options that were rejected and why.

`message` is a required string rather than projected content specifically
because of the overflow requirement: the banner must ellipsis-truncate
single-line text that doesn't fit, which is only reliable for a plain
string, not arbitrary projected markup.

`variant` has no default and no `neutral` option (unlike `ds-tag`) because
an alert banner with no stated severity isn't a supported use case — every
banner must say what kind of information it's carrying.

## Consequences

Changing the selector, removing a `variant` value, changing `message` from
a required input to something else, or removing
`dismissible`/`dismissLabel`/`dismissed` after the first public release is
a breaking change.

Adding a third named action slot, or changing the two existing slot names
(`primary-action`/`secondary-action`), is also breaking for any consumer
already using them.
