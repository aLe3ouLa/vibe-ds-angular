# Button

## Purpose

Use Button for actions that submit, confirm, start, or change something.

## Usage

```html
<ds-button>Play</ds-button>
<ds-button variant="secondary">Cancel</ds-button>
<ds-button [disabled]="true">Unavailable</ds-button>
```

## API

| Input | Values | Default | Description |
|---|---|---|---|
| `variant` | `primary`, `secondary`, `ghost` | `primary` | Visual emphasis |
| `disabled` | `true`, `false` | `false` | Prevents interaction |

## Accessibility

- Uses a native `button` element.
- Always has `type="button"`.
- Supports keyboard interaction.
- Uses the native disabled state.
- Provides a visible focus indicator.
- Button text must describe the action.

## Versioning

Adding a new variant is a minor release.

Removing or renaming an input is a breaking change and requires a major release or a deprecation cycle.