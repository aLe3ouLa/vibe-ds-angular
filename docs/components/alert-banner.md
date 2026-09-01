# Alert Banner

## Purpose

Use Alert Banner for system messages, background-process updates, and
cross-company announcements — things the system surfaces on its own
initiative. Don't use it to confirm an action the user just took; give
that inline/toast feedback instead.

## Usage

```html
<ds-alert-banner
  variant="info"
  message="Scheduled maintenance this Saturday, 10pm–12am UTC."
/>

<ds-alert-banner variant="warning" message="Your trial ends in 3 days.">
  <ds-button slot="primary-action" variant="secondary">Upgrade now</ds-button>
  <ds-button slot="secondary-action" variant="ghost">Not now</ds-button>
</ds-alert-banner>

<ds-alert-banner
  variant="error"
  message="We couldn't save your changes."
  [dismissible]="true"
  dismissLabel="Dismiss save error"
  (dismissed)="onDismiss()"
/>
```

### Two use cases this covers

1. **Announcement** — notify about an event or cross-company update.
   `variant="info"`, usually no actions.
2. **Upgrade opportunity** — show a trial user how many free days remain,
   with a way to act on it. `variant="warning"` (or `"info"`, depending on
   urgency) with a `primary-action` CTA.

## API

| Input | Values | Default | Description |
|---|---|---|---|
| `variant` | `error`, `warning`, `success`, `info` | *required* | Severity/color — no default, no `neutral` |
| `message` | `string` | *required* | The banner's text (single line, truncates with an ellipsis if it doesn't fit) |
| `dismissible` | `true`, `false` | `false` | Shows a dismiss button |
| `dismissLabel` | `string` | `'Dismiss'` | Accessible name for the dismiss button |

| Output | Payload | Description |
|---|---|---|
| `dismissed` | `void` | Emitted when the dismiss button is activated. The component does not remove itself — the consumer owns removing it. |

### Actions

Project up to two `ds-button` elements as actions, using `slot`:

- `slot="primary-action"`
- `slot="secondary-action"`

Don't put more than one action of the same weight in a banner — if two
actions are needed, use two visually distinct CTAs, one per slot. The
established pairing is `secondary` for `primary-action` and `ghost` for
`secondary-action` — deliberately not `primary`, so the banner's action
doesn't visually compete with a page's actual primary call to action.

**Known limitation: `ghost` fails text contrast on `error`/`success`/
`info` banners.** `ghost` buttons are transparent and use
`--ds-color-text-default` (dark) text, which assumes a light surface
behind them. On `error`/`success`/`info` banners (saturated
backgrounds) that pairing measures as low as ~3.4:1 against the banner
background — under the WCAG 4.5:1 minimum for normal text. It reads fine
on `warning`, whose background is light enough for dark text regardless.
This was raised during accessibility review and knowingly accepted to
keep `secondary`/`ghost` as the consistent pairing across all four
severities; `secondary` (opaque, self-contained contrast) remains the
safe fallback for a single-action banner if this gap needs to be
avoided.

## Accessibility

- `variant="error"` renders `role="alert"`; `warning`/`success`/`info`
  render `role="status"`. This only affects banners that appear or update
  after initial page load — screen readers announce live-region changes,
  not content already present at load.
- Severity is never conveyed by color alone: a visually-hidden text
  prefix ("Error:", "Warning:", "Success:", "Info:") precedes the message
  for screen reader users. The visible text is exactly your `message`.
- The dismiss button is a real `<button type="button">` — focusable,
  Enter/Space-activated, accessible name from `dismissLabel`.
- Actions are real `ds-button` elements and inherit that component's
  keyboard/focus behavior directly.
- Ellipsis truncation is visual only — the full `message` stays in the DOM
  and is available to assistive technology and find-in-page.

## Versioning

Adding a new `variant` value, or a third named action slot, is a minor
release (additive). Removing/renaming `message`, `variant`,
`dismissible`/`dismissLabel`/`dismissed`, or the `primary-action`/
`secondary-action` slot names is a breaking change.
