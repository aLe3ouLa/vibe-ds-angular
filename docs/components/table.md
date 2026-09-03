# Table

## Purpose

Use Table to display tabular data — orders, users, any list of records
with named columns — with consistent spacing, borders, and a shared empty
state, instead of every team hand-rolling `<table>` markup.

v1 is **static display only**: no sorting, row selection, pagination,
expandable rows, sticky header, or responsive/mobile row-stacking. See
[RFC 007](../governance/rfcs/007-table.md) for what was deferred and why.

## Usage

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
        <ds-table-cell>
          <ds-tag [variant]="order.statusVariant">{{ order.status }}</ds-tag>
        </ds-table-cell>
      </ds-table-row>
    }
  </tbody>
</ds-table>
```

Table is content-projected, not data-driven — write the rows yourself
(typically with `@for`) rather than passing a `rows` array. This is what
lets you put a `ds-tag`, a button, or any other component directly inside
a cell.

### Custom empty state

By default, when zero rows are in `<tbody>`, `ds-table` renders
`<ds-empty-state title="No data" />`. Project your own instead:

```html
<ds-table caption="Search results">
  <thead>...</thead>
  <tbody></tbody>
  <ds-empty-state
    slot="empty"
    title="No results"
    message="Try a different search term."
  />
</ds-table>
```

## API

### `ds-table`

| Input | Values | Default | Description |
|---|---|---|---|
| `caption` | `string \| null` | `null` | Rendered as a real `<caption>`, the table's accessible name |
| `captionVisible` | `true`, `false` | `true` | `false` visually hides the caption (stays in the DOM as the accessible name) |
| `ariaLabel` | `string \| null` | `null` | Overrides the table's accessible name entirely |
| `striped` | `true`, `false` | `false` | Zebra-stripes body rows |
| `size` | `small`, `medium`, `large` | `medium` | Row/cell density |

### `ds-table-row`

No inputs. Place inside `<thead>` for the header row, `<tbody>` for data
rows — detected structurally, not via a component input.

### `ds-table-cell`

| Input | Values | Default | Description |
|---|---|---|---|
| `header` | `true`, `false` | `false` | Renders as a header cell |

## Accessibility

- `ds-table-row` and `ds-table-cell` are custom elements, not literal
  `<tr>`/`<td>`/`<th>` — they recreate native table layout and semantics
  via CSS `display: table-row`/`table-cell` and explicit ARIA roles
  (`role="row"`; `role="columnheader"`/`role="cell"`). `<table>`,
  `<thead>`, and `<tbody>` themselves stay real native elements.
- `caption`/`ariaLabel` provide the table's accessible name; prefer
  `caption` when the table needs one at all — it's the native mechanism
  purpose-built for this.
- The empty state (default or projected `ds-empty-state`) carries
  `role="status"`, so a transition from populated to empty at runtime
  (e.g. after your own filter or fetch resolves) is announced to screen
  reader users.
- The table's horizontal scroll wrapper is `tabindex="0"` and keyboard
  operable, with `role="region"` and an accessible name sourced from
  `ariaLabel`/`caption` when either is set.

## Versioning

Adding sorting, selection, pagination, expandable rows, sticky header, or
responsive row-stacking is a minor release, each via its own RFC.

Removing or renaming an input, or changing the structural (DOM-position)
header/body detection, is a breaking change and requires a major release
or a deprecation cycle.
