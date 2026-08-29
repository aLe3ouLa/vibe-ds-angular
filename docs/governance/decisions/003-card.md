# Decision 003: Card API

- Status: Accepted
- Date: 2026-08-29
- Owner: Design System Team

## Decision

The public card selector is `ds-card`, accepted as proposed in
[RFC 002](../rfcs/002-card.md).

The initial API includes:

- `variant="default"` / `variant="subtle"`
- `padding="sm"` / `padding="md"` / `padding="lg"`
- A single default content projection — no header/footer slots

No new design tokens were introduced; the component consumes existing
surface, border, radius, and space semantic tokens only.

## Why

Product surfaces were already building this container by hand, causing the
same padding/radius/surface drift that `ds-button` and `ds-input` were
introduced to prevent. Elevation, header/footer slots, and a clickable
variant were explicitly cut from v1 rather than guessed at, since each has
its own accessibility or token-pipeline implications (see RFC 002's Open
questions) and no confirmed use case yet.

## Consequences

Changing the selector or removing `variant`/`padding` after the first
public release is a breaking change.

Adding `elevated`/shadow support later requires a token-pipeline change
first (new elevation primitives in `tokens/primitives.tokens.json`) before
it can be added to this component — it cannot be introduced as a
component-local value.

A clickable/navigable card variant requires its own RFC covering focus and
accessible-name behavior; it is not an incremental addition to this API.
