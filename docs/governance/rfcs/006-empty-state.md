# RFC: Empty State

- Status: Accepted
- Author: Alexandra
- Date: 2026-09-03
- Reviewers: Pending

## Problem

`ds-table`'s v1 (see [RFC 007](007-table.md)) needs a built-in "no data"
state for when zero rows are projected. Rather than hand-rolling that
markup as a private implementation detail of the table, this RFC proposes
it as its own small public component — a title, an optional description
message, and a place for an icon — so the same pattern is available
anywhere a design system consumer needs to communicate "there's nothing
here" (an empty list, empty search results, an empty dashboard panel),
not just inside a table.

## Proposed API

Selector `ds-empty-state`.

```html
<ds-empty-state title="No data" />

<ds-empty-state
  title="No results"
  message="Try adjusting your filters or search terms."
/>

<ds-empty-state title="No results" message="Try a different search.">
  <svg slot="icon" aria-hidden="true">...</svg>
</ds-empty-state>
```

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | *required* | Short headline, e.g. "No data" |
| `message` | `string \| null` | `null` | Optional supporting description |

An `icon` slot (`<ng-content select="[slot=icon]">`) accepts arbitrary
projected markup — no icon is rendered by default.

## Alternatives

- **A DS-owned icon per use case** (e.g. a `variant` picking from a
  built-in icon set): rejected for v1. `ds-tag` and `ds-alert-banner`
  both already deferred an icon-per-variant for the identical stated
  reason — no confirmed asset/icon system exists in this library yet.
  Building one now, as a side effect of an empty-state component, would
  reopen that exact deferred decision without the library-wide RFC it
  deserves.
- **No icon support at all**: rejected. A content-projection slot costs
  nothing (no asset ownership, no taxonomy) and gives consumers who
  already have their own icon somewhere a place to put it, without the
  design system needing to pick or ship one.
- **Style variants** (matching `ds-alert-banner`'s
  `error`/`warning`/`success`/`info`): rejected. "No data" isn't a
  severity or status the way an alert is — every real use case (empty
  table, empty list, empty search results) wants the same neutral
  appearance. Add variants later by RFC if a genuine "error while
  loading" vs. "no data yet" distinction shows up.
- **Internal-only, not exported**: considered, since the only confirmed
  consumer at proposal time is `ds-table`. Rejected in favor of shipping
  it as a full public component so it's independently reusable and
  independently versioned, rather than bundling its design into the
  table RFC.

## Accessibility

Root element carries `role="status"` (implicit `aria-live="polite"`),
always — not conditional on any input. This matters specifically for its
use inside `ds-table`: content there is consumer-projected, so a
transition from "has rows" to "no rows" (e.g. after a filter or async
fetch resolves) needs to be announced to screen reader users, not silent.
A plain informational "no data" message never rises to `role="alert"`,
so unlike `ds-alert-banner` there's no variant-driven role switch here.

The icon slot has no built-in `aria-hidden` — a projected icon is the
consumer's responsibility to mark decorative (or not), same as any other
projected content in this library.

## Design tokens

No new tokens. Reuses `--ds-color-text-default` (title),
`--ds-color-text-muted` (message), spacing (`--ds-space-2/4/8`), and font
tokens.

## Versioning impact

New public component: minor release.

## Adoption and migration

Discovery path: public API, Storybook (`Data Display/Empty State`),
`docs/components/empty-state.md`, `component-registry.json`. No migration
path — no existing empty-state component in the library. `ds-table`
consumes it as its built-in default empty state (see RFC 007).

## Open questions

- Icon support is a projection slot, not a DS-owned icon asset — revisit
  once a library-wide icon system gets its own RFC.
- No style variants yet; add by RFC if a concrete "error" vs. "empty"
  distinction is needed.
