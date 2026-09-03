# Empty State

## Purpose

Use Empty State to communicate "there's nothing here" — an empty table,
an empty list, zero search results — with a consistent title, optional
description, and optional icon, instead of every team hand-rolling their
own "no data" message.

## Usage

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

`ds-table` renders this internally as its default empty state when zero
rows are projected — see [Table](table.md).

## API

| Input | Values | Default | Description |
|---|---|---|---|
| `title` | `string` | *required* | Short headline |
| `message` | `string \| null` | `null` | Optional supporting description |

| Slot | Description |
|---|---|
| `[slot=icon]` | Optional projected icon markup. No icon renders by default — the design system doesn't ship or pick icon assets yet. |

## Accessibility

- Root element carries `role="status"`, so screen reader users are
  notified when this component appears — relevant when it replaces
  previously-populated content (e.g. after a filter or search resolves to
  zero results).
- No style variants; a single neutral appearance is used regardless of
  context.

## Versioning

Removing or renaming `title`/`message`, or changing the icon slot's
projection selector, is a breaking change and requires a major release or
a deprecation cycle.
