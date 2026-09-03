# Decision 008: Table API

- Status: Accepted
- Date: 2026-09-03
- Owner: Design System Team

## Decision

The public table selectors are `ds-table`, `ds-table-row`, and
`ds-table-cell`, accepted as proposed in [RFC 007](../rfcs/007-table.md).

v1 is **static display only** — no sorting, row selection, pagination,
expandable rows, sticky header, or responsive/mobile row-stacking.

The initial API includes:

- `ds-table`: `caption`, `captionVisible` (default `true`),
  `ariaLabel`, `striped` (default `false`), `size`
  (`small`\|`medium`\|`large`, default `medium`)
- `ds-table-row`: no inputs — header vs. body determined structurally by
  DOM position (inside `<thead>` vs. `<tbody>`)
- `ds-table-cell`: `header` (default `false`)
- Content-projected, not data-driven — a consumer writes
  `<thead>`/`<tbody>`/`ds-table-row`/`ds-table-cell` markup directly
- A built-in empty state, falling back to `ds-empty-state` (see
  [Decision 007](007-empty-state.md)) when zero data rows are projected
  and no `<ds-empty-state slot="empty">` is projected instead
- A built-in `overflow-x: auto`, keyboard-scrollable wrapper around the
  table for wide-table safety

One new semantic token was added: `--ds-color-surface-hover` (aliasing
existing primitive `color.gray.200`), needed once both `striped` and
per-row hover required visually distinct tinted backgrounds.

## Why

Content-projection over a data-driven API because a data-driven table
can't render a `ds-tag` or button inside a cell without a template escape
hatch — content-projection needs no such escape hatch, and needs no
generic row-type parameter either. Hand-rolled markup, not
`@angular/cdk`'s `CdkTable`, for the same reason `ds-dropdown` avoided
CDK Overlay: `CdkTable`'s value is rendering from a `DataSource`, which a
projection-based table has no use for.

Static-display-only v1 follows the same "small v1, grow by RFC" pattern
every other component in this library has followed — sorting, selection,
pagination, expansion, sticky header, and responsive stacking are each
real API commitments without a confirmed use case yet.

The built-in empty state and scroll wrapper are treated as baseline
correctness, not optional features some future RFC could add: a table
with projected content that goes from populated to empty at runtime
(e.g. after a filter) needs an accessible announcement, and a table wider
than its container needs to not break page layout. Both are cheap to
include and expensive for every consumer to rediscover independently.

## Consequences

Changing either selector, removing an input, or changing
`ds-table-row`/`ds-table-cell`'s structural (DOM-position-based)
header/body detection after the first public release is a breaking
change.

`--ds-color-surface-hover` is now part of the public token surface
(available via `list_tokens`) — removing or repurposing it is also a
breaking change, not just a `ds-table` concern.

`ds-table` depends on `ds-empty-state` ([Decision 007](007-empty-state.md))
for its default empty state; a breaking change to `ds-empty-state`'s API
is also a `ds-table` concern.

Any future sorting RFC will need to reconcile sort state with a
content-projected row model — noted as an open question in RFC 007.
