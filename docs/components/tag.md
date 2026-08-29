# Tag

## Purpose

Use Tag for a small inline status or category label — "Active", "Beta",
"Failed" — so status color and shape stay consistent instead of every
team hand-rolling their own.

## Usage

```html
<ds-tag>Beta</ds-tag>
<ds-tag variant="success">Active</ds-tag>
<ds-tag variant="error">Failed</ds-tag>
<ds-tag variant="warning">Pending review</ds-tag>
<ds-tag variant="info">New</ds-tag>

<ds-tag
  variant="info"
  [dismissible]="true"
  dismissLabel="Remove filter: Beta"
  (dismissed)="removeFilter('beta')"
>
  Beta
</ds-tag>
```

## API

| Input | Values | Default | Description |
|---|---|---|---|
| `variant` | `neutral`, `success`, `error`, `warning`, `info` | `neutral` | Status color |
| `dismissible` | `true`, `false` | `false` | Shows a dismiss button |
| `dismissLabel` | `string` | `'Remove tag'` | Accessible name for the dismiss button |

| Output | Payload | Description |
|---|---|---|
| `dismissed` | `void` | Emitted when the dismiss button is activated. The component does not remove itself — the consumer owns removing it from whatever list produced it. |

## Accessibility

- Tag root is a non-interactive `<span>`, no ARIA role, not a focus
  target.
- The dismiss button (when `dismissible` is `true`) is a real
  `<button type="button">`, so it's focusable and works with Enter/Space
  for free.
- The dismiss button's accessible name comes from `dismissLabel`, not the
  tag's content. Override the default (`'Remove tag'`) with something
  specific whenever more than one dismissible tag can appear together, so
  screen reader users can tell them apart — e.g. `"Remove filter: Beta"`.
- Convey status through the tag's **text**, not color alone. `variant` is
  reinforcement, not the only signal.

## Versioning

Adding a new `variant` value is a minor release. `warning` and `info`
required a token-pipeline change adding `--ds-color-feedback-warning` and
`--ds-color-feedback-info` — those tokens are now part of the public
surface too.

Removing or renaming an input/output is a breaking change and requires a
major release or a deprecation cycle.
