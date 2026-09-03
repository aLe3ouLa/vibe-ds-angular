# Decision 007: Empty State API

- Status: Accepted
- Date: 2026-09-03
- Owner: Design System Team

## Decision

The public empty-state selector is `ds-empty-state`, accepted as proposed
in [RFC 006](../rfcs/006-empty-state.md).

The initial API includes:

- `title` (required string) — short headline
- `message` (optional string) — supporting description
- A projected `[slot=icon]` — no DS-owned icon asset

No style variants. Root element always carries `role="status"`.

## Why

`ds-table` (see [Decision 008](008-table.md)) needed a built-in "no data"
state; shipping it as its own public component rather than a private
implementation detail keeps it reusable for any other "nothing here" case
(empty list, empty search results) without a second RFC later.

The icon is a content-projection slot rather than a DS-owned icon per
variant, because `ds-tag` and `ds-alert-banner` already deferred exactly
that for the same reason: no confirmed icon asset system exists yet in
this library. A slot sidesteps that gap entirely instead of reopening it.

`role="status"` is unconditional (not variant-gated, unlike
`ds-alert-banner`'s `alert`/`status` switch) because an empty state is
never an error-severity announcement — and it needs to be correct inside
`ds-table`, where projected content can transition from populated to
empty at runtime.

## Consequences

Changing the selector, removing `title`/`message`, or changing the icon
slot's projection selector after the first public release is a breaking
change.

`ds-table`'s built-in empty state depends on this component — see
[Decision 008](008-table.md).
