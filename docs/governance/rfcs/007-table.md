# RFC: Table

- Status: Accepted
- Author: Alexandra
- Date: 2026-09-03
- Reviewers: Pending

## Problem

Teams need a way to display tabular data — orders, users, any list of
records with named columns — with consistent styling instead of every
team hand-rolling `<table>` markup with inconsistent spacing, borders,
and no shared empty state.

Like every other component in this library, this RFC scopes a small v1:
**static display only**. Sorting, row selection, pagination, expandable
rows, sticky headers, and responsive/mobile row-stacking are all real API
commitments, each deferred to its own future RFC — matching how
`ds-dropdown` deferred grouped options, virtualization, and chip overflow
rather than porting a full-featured reference spec wholesale.

## Proposed API

Selectors `ds-table`, `ds-table-row`, `ds-table-cell` — content-projected,
not data-driven. A consumer writes semantic markup directly, mirroring
native `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<td>`/`<th>`:

```html
<ds-table caption="Recent orders">
  <thead>
    <ds-table-row>
      <ds-table-cell [header]="true">Order</ds-table-cell>
      <ds-table-cell [header]="true">Customer</ds-table-cell>
      <ds-table-cell [header]="true">Status</ds-table-cell>
    </ds-table-row>
  </thead>
  <tbody>
    @for (order of orders; track order.id) {
      <ds-table-row>
        <ds-table-cell>{{ order.id }}</ds-table-cell>
        <ds-table-cell>{{ order.customer }}</ds-table-cell>
        <ds-table-cell><ds-tag [variant]="order.statusVariant">{{ order.status }}</ds-tag></ds-table-cell>
      </ds-table-row>
    }
  </tbody>
</ds-table>
```

### `ds-table` inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `caption` | `string \| null` | `null` | Rendered as a real `<caption>` |
| `captionVisible` | `boolean` | `true` | `false` visually hides the caption (still in the DOM as the table's accessible name) |
| `ariaLabel` | `string \| null` | `null` | Overrides the table's accessible name |
| `striped` | `boolean` | `false` | Zebra-stripes body rows |
| `size` | `small`\|`medium`\|`large` | `medium` | Row/cell density, matches `ds-dropdown`/`ds-input`'s `size` |

`ds-table` also renders a built-in empty state when zero data rows are
projected (see Accessibility / Empty state below).

### `ds-table-row`

No inputs. Renders as `display: table-row` with `role="row"`. A row
placed inside `<thead>` is the header row; rows inside `<tbody>` are data
rows — determined structurally (`closest('thead')`), not by a component
input.

### `ds-table-cell`

| Input | Type | Default | Description |
|---|---|---|---|
| `header` | `boolean` | `false` | Renders as a header cell (`role="columnheader"`) instead of a data cell (`role="cell"`) |

## Alternatives

- **Data-driven API** (`[columns]="columns" [rows]="rows"`, generic over
  a row type `T`, similar to `ds-dropdown`'s `DropdownOption<T>`):
  rejected in favor of a hybrid-leaning-projected model. Pure data-driven
  can't render a `ds-tag` or a button inside a cell without a template
  escape hatch, and that need is near-certain for a real design system —
  see the `ds-tag`-in-cell usage in the Storybook stories. Between a
  hybrid (data arrays + cell templates) and pure content-projection, pure
  projection was chosen: it needs no generic type parameter, no column
  configuration object, and lets Angular's own `@for` do exactly what a
  data-driven API would otherwise reinvent.
- **`@angular/cdk`'s `CdkTable`**: rejected. `CdkTable`'s entire value
  proposition is rendering rows from a `DataSource` — with a pure
  content-projection model there's nothing for it to do. Matches the
  explicit no-CDK precedent from `ds-dropdown`'s RFC.
- **Full sub-component mirror** (separate `ds-table-head`/`ds-table-body`
  components matching every native table element): rejected. `<thead>`
  and `<tbody>` carry no interactive behavior or accessibility logic
  worth wrapping — they're purely structural, so plain HTML is used for
  those two, while `ds-table-row`/`ds-table-cell` (which need consistent
  styling and token usage) get real components.
- **Sorting, row selection, pagination, expandable rows, sticky header,
  responsive/mobile stacking**: all deferred, not silently dropped. None
  have a confirmed use case yet in this repo; each is a real API-surface
  commitment (sorting alone implies `aria-sort` state, keyboard
  activation, and an interaction with the empty-state/data-driven
  question) that deserves its own RFC once needed.
- **No built-in empty state / no built-in scroll wrapper**: rejected —
  see Accessibility below for why both are baseline behaviors rather than
  optional features.
- **Fixed default empty-state text only** (no way to customize): rejected
  in favor of allowing a projected `ds-empty-state` — see Empty state
  below.

## Accessibility

### A real implementation constraint: components aren't native table tags

Angular components render as custom elements (`<ds-table-row>`,
`<ds-table-cell>`), which can never literally become `<tr>`/`<td>`/`<th>`.
`<table>` itself stays a real native element in `ds-table`'s own template
(with real `<thead>`/`<tbody>` projected directly beneath it via
`<ng-content select="thead/tbody">`), but the rows and cells nested inside
those sections are custom elements.

This is handled the same way `mat-table` and similar libraries handle it:
CSS `display: table-row` / `display: table-cell` recreates the visual
table layout regardless of tag name (the CSS table layout algorithm
operates on computed `display`, not on element type), and explicit ARIA
roles (`role="row"` on `ds-table-row`; `role="columnheader"`/`role="cell"`
on `ds-table-cell` depending on `header`) recreate the accessibility tree
that real `<tr>`/`<th>`/`<td>` elements would have produced for free.
Angular renders templates by direct DOM node creation, not by parsing an
HTML string, so the browser's table-specific foster-parenting rules
(which only trigger during HTML-string parsing) don't interfere with
custom elements living inside `<thead>`/`<tbody>`.

### Caption and accessible name

`caption` renders a real `<caption>` — the native HTML mechanism for a
table's accessible name — **visible by default** (`captionVisible`
defaults to `true`). A consumer whose page already has its own heading
above the table can set `captionVisible="false"` to keep the caption in
the DOM (still the table's accessible name) without duplicating it
visually. `ariaLabel`, when set, overrides the accessible name entirely
(`aria-label` takes precedence over `<caption>` in accessible-name
computation), for cases where a consumer wants no caption relationship at
all.

### Empty state

`ds-table` detects zero projected data rows (via a content query over
`ds-table-row`, filtering out the header row) and renders a `ds-table`
empty state region in its place. A consumer may project a custom
`<ds-empty-state slot="empty" .../>` as a direct child of `<ds-table>`;
if none is projected, `ds-table` falls back to
`<ds-empty-state title="No data" />`. Either way, `ds-empty-state`'s own
`role="status"` (see [RFC 006](006-empty-state.md)) means a transition
from populated to empty — e.g. after a consumer's own async filter
resolves to zero rows — is announced to screen reader users, even though
`ds-table` itself has no async/loading concept in v1.

### Wide-table scroll wrapper

`ds-table`'s host wraps its `<table>` in an `overflow-x: auto` container
(`tabindex="0"`, and `role="region"` with an `aria-label` sourced from
`ariaLabel` or `caption` when either is available) so a table wider than
its container never breaks page layout and stays keyboard-scrollable —
independent of the deferred "responsive stacking" feature. This is a
baseline layout-safety behavior, not a feature: harmless for consumers
who don't need it, and avoids every table consumer independently
rediscovering "wrap it in `overflow-x: auto`" (and separately,
rediscovering that a scrollable region needs `tabindex="0"` to be
keyboard-operable at all).

### Striping and hover, and a token gap this surfaced

`striped` and per-row hover are both supported. This surfaced a real gap:
the only "tinted surface" token that existed before this RFC was
`--ds-color-surface-subtle`, which `striped` also needs — reusing it for
hover too would make a striped row's hover state invisible. A new
semantic token, `--ds-color-surface-hover` (aliasing the existing
`color.gray.200` primitive — no new primitive color introduced), was
added so each token keeps one meaning. See Design tokens below.

Both are implemented via `:host-context()` in `ds-table-row`'s
stylesheet rather than any imperative DOM manipulation: `nth-of-type`
counts only among siblings sharing the same parent, so a header row (the
sole child of `<thead>`) never participates in `tbody`'s even/odd
striping count — no explicit "am I a header row" CSS class is needed for
correctness, just for the header cell's own bold/muted styling in
`ds-table-cell`.

## Design tokens

Reuses existing spacing (`--ds-space-1/2/3/4`), color
(`--ds-color-border-default`, `--ds-color-surface-subtle`,
`--ds-color-text-default/muted`, `--ds-color-action-primary`), and font
tokens.

**One new token**: `--ds-color-surface-hover` (new semantic alias for the
existing primitive `color.gray.200`, no new hex value introduced) — see
Accessibility above for why `surface-subtle` alone wasn't sufficient once
both striping and hover needed distinct, simultaneously-visible tints.

## Versioning impact

New public components (`ds-table`, `ds-table-row`, `ds-table-cell`) and a
new semantic color token: minor release.

## Adoption and migration

Discovery path: public API, Storybook (`Data Display/Table`),
`docs/components/table.md`, `component-registry.json`. No migration
path — no existing table component in the library.

## Open questions

- Sorting, row selection, pagination, expandable rows, sticky header, and
  responsive/mobile row-stacking are all deferred — no confirmed use case
  yet. Sorting in particular will need to revisit the empty-state and
  content-projection interaction (e.g. does a sort change re-order
  projected `ds-table-row` elements, or does it imply a data-driven
  escape hatch after all?).
- The built-in scroll wrapper covers the table's own horizontal overflow
  only; it doesn't address a nested independently-scrolling ancestor, the
  same class of gap `ds-dropdown`'s RFC flagged for its portal
  positioning.
- `ds-table-cell`'s `header` boolean doesn't yet distinguish a row header
  (`role="rowheader"`) from a column header — no confirmed use case for
  row headers yet.
