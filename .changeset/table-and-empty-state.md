---
"@alexandra/design-system": minor
---

Add `ds-table` and `ds-empty-state`.

`ds-table` (with `ds-table-row`/`ds-table-cell`) is a static-display
table — content-projected, not data-driven, so any component (e.g.
`ds-tag`) can be placed inside a cell. Supports `caption`/
`captionVisible`/`ariaLabel`, `striped`, and `size`. Includes a built-in
empty state and a keyboard-scrollable overflow wrapper for wide tables.
Sorting, row selection, pagination, expandable rows, sticky header, and
responsive row-stacking are deferred to future RFCs.

`ds-empty-state` is a standalone "no data" component (`title`, optional
`message`, and a projected icon slot) — `ds-table` uses it internally for
its default empty state, and it's reusable anywhere else the same
"nothing here" pattern applies.

One new design token: `--ds-color-surface-hover`, needed once `striped`
and per-row hover both required visually distinct tinted backgrounds.
