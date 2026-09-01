# RFC: Alert Banner

- Status: Accepted
- Author: Alexandra
- Date: 2026-09-01
- Reviewers: Pending

## Problem

Product teams need a full-width banner for system messages, background
process updates, and cross-company announcements — "scheduled maintenance
Saturday," "your export is ready," "3 days left on your trial." Without a
shared component, teams reach for ad-hoc colored `<div>`s with inconsistent
severity colors, inconsistent dismiss behavior, and inconsistent (or
missing) screen-reader semantics. This is explicitly **not** a replacement
for confirming an action the user just took (a toast/inline message covers
that) — banners are for information the system surfaces on its own
initiative.

## Proposed API

The component selector is `ds-alert-banner`.

```html
<ds-alert-banner variant="info" message="Scheduled maintenance this Saturday, 10pm–12am UTC." />

<ds-alert-banner variant="warning" message="Your trial ends in 3 days.">
  <ds-button slot="primary-action" variant="secondary">Upgrade now</ds-button>
  <ds-button slot="secondary-action" variant="ghost">Not now</ds-button>
</ds-alert-banner>

<ds-alert-banner
  variant="error"
  message="We couldn't save your changes. Try again."
  [dismissible]="true"
  dismissLabel="Dismiss save error"
  (dismissed)="onDismiss()"
/>
```

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `error`, `warning`, `success`, `info` | *required* | Severity/color. No default — every banner must state its severity explicitly. |
| `message` | `string` | *required* | The banner's text. A plain string, not projected content — see Alternatives. |
| `dismissible` | `boolean` | `false` | Shows a dismiss button |
| `dismissLabel` | `string` | `'Dismiss'` | Accessible name for the dismiss button |

### Output

| Output | Payload | Description |
|---|---|---|
| `dismissed` | `void` | Emitted when the dismiss button is activated. Matches `ds-tag`: the component signals intent, it does not remove itself. |

### Actions (content projection)

Up to two actions, each a consumer-supplied `ds-button`, projected via a
`slot` attribute:

- `slot="primary-action"` — the primary call to action
- `slot="secondary-action"` — a secondary call to action

The component does not accept an array of arbitrary actions. Two named
slots is a deliberate ceiling: per the product guidance driving this RFC,
a banner should never carry more than one action of the same weight
("don't include more than one action with the same type"), and an
open-ended action list makes that easy to violate. Two named, differently-
weighted slots make the *intended* usage the only usage the API makes
convenient. (This is a convention, not a hard constraint — Angular content
projection cannot stop a consumer from placing two buttons in the same
slot. See Alternatives.)

## Alternatives

- **`message` as content projection instead of a string input**: rejected.
  The product spec requires single-line ellipsis truncation when the
  message doesn't fit ("Overflow text ... use an ellipsis"). That's only
  reliably guaranteed for a single plain-text node — arbitrary projected
  markup (nested elements, inline formatting) makes CSS `text-overflow:
  ellipsis` unreliable. A required string input, the same shape as
  `ds-input`'s `label`, makes the correct (truncatable) usage the only
  usage. Actions are still projected — see below — because they're already
  interactive components (`ds-button`) with their own variant/state API
  that a string+output pair would have to reinvent.
- **Actions as `primaryActionLabel: string` + `primaryAction` output
  (mirroring `dismissLabel`/`dismissed`)**: rejected. This is exactly the
  `actionLabel: string` pattern flagged as a smell — it would force every
  action to be a plain-text button with no way to set a `ds-button`
  `variant`, disabled state, or anything else the button component already
  provides. Projecting real `ds-button` elements reuses that API instead
  of re-describing it.
- **An open `actions: TemplateRef[]` or unstructured `<ng-content>` for
  all actions**: rejected — this is precisely what produces "three CTAs of
  the same visual weight" banners the product guidance warns against. Two
  named slots (`primary-action`, `secondary-action`) is the smallest API
  that matches the stated usage rule.
- **A `neutral` variant (matching `ds-tag`)**: rejected for this
  component. An alert banner without a stated severity isn't a supported
  use case here — `variant` is required, with no neutral fallback, so a
  consumer can't accidentally ship an unstyled/ambiguous banner.
- **Icon per variant**: deferred, same reasoning as `ds-tag`'s deferred
  icon slot — no confirmed asset/icon system exists in this library yet.
  Severity is instead reinforced for screen reader users via a visually-
  hidden text prefix (see Accessibility), avoiding a dependency on an icon
  system that doesn't exist yet while still not relying on color alone.

## Accessibility

- Root element carries `role="alert"` for `variant="error"` and
  `role="status"` for `warning`/`success`/`info`. Rationale: an error
  banner is closer to the WAI-ARIA "Alert" pattern (urgent, assertive) than
  the other three severities, which match "Status" (polite, non-
  interruptive) — see `references/aria-patterns.md`'s Alert vs Status
  distinction. This only affects banners that appear or update *after*
  initial page load; a banner present in the initial render is read
  through normal document order regardless of role, so nothing is lost for
  that case either way.
- Severity is not conveyed by color alone: a visually-hidden text prefix
  ("Error:", "Warning:", "Success:", "Info:") precedes the message for
  screen reader users. The visible text is exactly the consumer's
  `message` — no forced visible prefix.
- The dismiss button (when `dismissible` is `true`) is a real
  `<button type="button">`, matching `ds-tag`'s dismiss button — focusable
  and Enter/Space-activated for free, accessible name from `dismissLabel`.
- Actions are real `<ds-button>` elements, so they inherit that
  component's existing keyboard/focus contract with no extra work here.
- Ellipsis truncation (`text-overflow: ellipsis`) is a purely visual
  affordance — the full `message` string is still in the DOM and available
  to assistive technology and browser find-in-page; nothing is hidden from
  screen readers when text is visually truncated.
- **Known, accepted limitation**: the established action pairing is
  `secondary` for `primary-action` and `ghost` for `secondary-action`.
  `ghost` (`ds-button`'s transparent variant, dark `--ds-color-text-
  default` text) measures as low as ~3.4:1 against the `error`/`success`/
  `info` banner backgrounds — under the WCAG 4.5:1 minimum for normal
  text. It passes comfortably on `warning`, the only variant with a light
  enough background for dark text. This was surfaced during accessibility
  review; the pairing was kept anyway so the action styling stays
  consistent across all four severities, rather than swapping variants
  per severity. `secondary` alone (self-contained opaque contrast) is the
  documented fallback for a single-action banner where this gap should be
  avoided.

## Design tokens

No new tokens. Reuses `ds-tag`'s existing feedback pairing exactly, since
the product guidance is explicit about not introducing new colors:

| Variant | Background | Text |
|---|---|---|
| `error` | `--ds-color-feedback-error` | `--ds-color-text-inverse` |
| `warning` | `--ds-color-feedback-warning` | `--ds-color-text-default` |
| `success` | `--ds-color-feedback-success` | `--ds-color-text-inverse` |
| `info` | `--ds-color-feedback-info` | `--ds-color-text-inverse` |

Spacing/radius: `--ds-space-2`/`--ds-space-3`/`--ds-space-4`,
`--ds-radius-md`.

## Versioning impact

New public component: minor release. No existing component or token
changes.

## Adoption and migration

Same discovery path as `ds-tag`: public API, Storybook
(`Feedback/Alert Banner`), `docs/components/alert-banner.md`, and the MCP
server (`component-registry.json` entry). No migration path — no existing
banner in the library to replace.

## Open questions

- Icon-per-variant, deferred pending a library-wide icon system decision
  (same open item `ds-tag` deferred).
- Whether a banner needs an "auto-dismiss after N seconds" behavior for
  the background-process use case is not addressed here — out of scope
  until a concrete use case asks for it.
