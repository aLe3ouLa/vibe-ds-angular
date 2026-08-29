# Card

## Purpose

Use Card to group related content on a surface with consistent padding,
border, and corner radius.

## Usage

```html
<ds-card>
  <h3>Plan usage</h3>
  <p>You've used 8 of 10 seats this month.</p>
</ds-card>

<ds-card variant="subtle" padding="lg">
  <p>Quieter surface, more breathing room.</p>
</ds-card>
```

## API

| Input | Values | Default | Description |
|---|---|---|---|
| `variant` | `default`, `subtle` | `default` | Background/border treatment |
| `padding` | `sm`, `md`, `lg` | `md` | Internal spacing |

## Accessibility

- Renders as a plain `<div>` with no implicit ARIA role.
- Not a keyboard-focus target.
- Add a heading (`<h2>`–`<h6>`) inside the card when its content needs a
  name or landmark — the component does not prescribe heading level.

## Versioning

Adding a new `variant` or `padding` value is a minor release.

Removing or renaming an input is a breaking change and requires a major
release or a deprecation cycle.
