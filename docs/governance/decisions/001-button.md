# Decision 001: Button API

- Status: Accepted
- Date: 2026-08-28
- Owner: Design System Team

## Decision

The public button selector is `ds-button`.

The initial API includes:

- `variant="primary"`
- `variant="secondary"`
- `[disabled]="true"`

## Why

The `ds-` prefix identifies components owned by the design system and reduces selector collisions with consuming applications.

## Consequences

Changing the selector or removing an input after the first public release is a breaking change.

Future API changes must be proposed before implementation when they affect consumers, accessibility, theming, or component composition.