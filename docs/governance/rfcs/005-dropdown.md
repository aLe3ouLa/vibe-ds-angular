# RFC: Dropdown (Select)

- Status: Accepted
- Author: Alexandra
- Date: 2026-09-01
- Reviewers: Pending

## Problem

Teams need a control for picking one or several values from a short list
(5-8 items) where an action is initiated based on the selection — the
"basic dropdown" use case, not a large-dataset async select. Without a
shared component, teams reach for native `<select>` (can't be styled with
a popup listbox, per-item states, or search) or hand-roll a custom
listbox with inconsistent keyboard/ARIA behavior.

This RFC intentionally scopes a v1 rather than porting a full-featured
reference spec (grouped/sticky headers, per-option icons/avatars/
tooltips, virtualization, single-line chip overflow) wholesale — matching
how every other component in this library (`ds-button`, `ds-card`,
`ds-tag`, `ds-alert-banner`) stayed small and grew by RFC, not by
speculative API surface.

## Proposed API

Selector `ds-dropdown`, generic over the option value type.

```html
<ds-dropdown
  [options]="options"
  label="Favorite fruit"
  placeholder="Select a fruit"
/>

<ds-dropdown
  [options]="options"
  label="Favorite fruits"
  [multiple]="true"
  [(ngModel)]="selectedFruits"
/>

<ds-dropdown
  [options]="options"
  label="Favorite fruit"
  [searchable]="true"
  [clearable]="true"
  clearAriaLabel="Clear favorite fruit"
/>
```

```ts
export interface DropdownOption<T> {
  value: T;
  label: string;
}
```

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `options` | `DropdownOption<T>[]` | *required* | The list to choose from |
| `label` | `string` | *required* | Visible label, matches `ds-input` |
| `placeholder` | `string` | `''` | Shown when nothing is selected |
| `multiple` | `boolean` | `false` | Select one value or several |
| `searchable` | `boolean` | `false` | Filter options by typing |
| `clearable` | `boolean` | `false` | Shows a clear-selection button |
| `size` | `small`\|`medium`\|`large` | `medium` | Matches `ds-input`'s sizes |
| `disabled` | `boolean` | `false` | |
| `readonly` | `boolean` | `false` | Focusable, but the menu can't open |
| `error` | `string \| null` | `null` | Matches `ds-input`'s error pattern |
| `hint` | `string \| null` | `null` | Matches `ds-input`'s hint pattern |
| `autoFocus` | `boolean` | `false` | Focuses the trigger on init |
| `ariaLabel` | `string \| null` | `null` | Overrides the accessible name |
| `menuAriaLabel` | `string \| null` | `null` | Accessible name for the listbox |
| `clearAriaLabel` | `string` | `'Clear selection'` | Name for the clear button |

Implements `ControlValueAccessor` (works with `[(ngModel)]` and reactive
forms, matching `ds-input`). Value is `T | null` when `multiple` is
`false`, `T[]` when `true` — the same duality native `<select multiple>`
has. `multiple` is treated as fixed configuration, not expected to change
at runtime, the same assumption native HTML makes.

## Alternatives

- **A separate `id` input** (the common React pattern for label
  association): rejected. `ds-input` already solves label association by
  generating an internal id via `crypto.randomUUID()` and using
  `<label for>` internally — reusing that convention needs no public API
  surface at all, and `<button>`/`<input>` are both labelable elements so
  it works for either trigger mode.
- **A separate `inputAriaLabel` distinct from `ariaLabel`**: rejected. Only
  one trigger element exists at a time (button when closed-select, input
  when searchable) — one `ariaLabel` input covers both, a deliberate
  simplification versus specs that expose one label prop per internal
  element.
- **A `selectionChange` output alongside `ControlValueAccessor`**:
  rejected — `ds-input` has no equivalent duplicate change channel; CVA's
  `onChange` is sufficient and consistent.
- **Grouped options, per-option icon/avatar/tooltip, virtualization or a
  custom `menuRenderer`, single-line chip overflow ("+N more")**: all
  deferred, not silently dropped. None have a concrete use case yet in
  this repo; each is a real API-surface commitment (virtualization
  especially implies a different rendering model) that deserves its own
  RFC once needed, matching how `ds-tag` deferred its icon slot.
- **`@angular/cdk` Overlay for popup positioning**: rejected for v1 to
  avoid a new dependency for a "5-8 items" component. The listbox is
  positioned via a small amount of first-party logic instead — see
  Accessibility/Focus below for what that actually required in practice.
- **Chips as bespoke markup**: rejected — multi-select renders each
  selected value as `<ds-tag [dismissible]="true">`, reusing an existing
  public component instead of introducing a second removable-pill pattern.

## Accessibility

Two trigger modes, chosen by `searchable`:

- **Not searchable**: a real `<button type="button">` —
  `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`. Typeahead
  (jump to an option by its first letter) is implemented here only.
- **Searchable**: a real `<input type="text">` acting as an editable
  combobox — `role="combobox"`, `aria-autocomplete="list"`,
  `aria-expanded`, `aria-controls`, `aria-activedescendant`. Space is
  never hijacked for selection in this mode, since it must still type a
  space character.

The popup is `role="listbox"` (`aria-multiselectable="true"` when
`multiple`), options are `role="option"` with `aria-selected`. Real DOM
focus **stays on the trigger** at all times — the highlighted option is
tracked via `aria-activedescendant`, not by moving focus into the popup,
per `keyboard-interactions.md`'s guidance on that pattern (avoids the
much harder problem of managing focus entering/leaving a popup).

Keyboard: ArrowDown/ArrowUp open the menu or move the highlighted option
(no wrap); Home/End jump to first/last; Enter/Space (button trigger only)
commit the highlighted option — closing the menu for single-select,
staying open for multi-select; Escape closes without changing selection
and leaves focus on the trigger. Clicking outside the component (a
`document:click` host listener) closes the menu without a change.

### Popup positioning — a real implementation surprise

The plan for this RFC was "a simple `position: absolute` panel, no CDK."
In practice this broke in Storybook's own docs page: the docs-page story
preview wraps each story in a box with `overflow: auto` sized to the
*closed* component's height, and a separate zoom-controls wrapper applies
`transform: matrix(1,0,0,1,0,0)` — an identity transform, but any
non-`none` transform value creates a new CSS containing block for
`position: fixed` descendants too, so even switching to `position: fixed`
computed from the trigger's `getBoundingClientRect()` still got trapped.

The fix that actually works, still without `@angular/cdk`: the listbox is
re-parented to `document.body` via `Renderer2` once it renders (see
`dropdown.ts`'s constructor `effect()`), removing every intermediate
ancestor — and therefore every ancestor's `overflow` or `transform` — from
the equation entirely. Angular tracks the view by its own internal view
references, not DOM parentage, so this manual "portal" is safe: the `@if`
block that creates/destroys the listbox still works correctly regardless
of where in the DOM the node currently lives.

One consequence worth noting for future maintainers: once re-parented to
`<body>`, the listbox is no longer a descendant of `:host` in the DOM, so
plain CSS `inherit` (e.g. `font-family: inherit`) no longer reaches it —
it must reference design tokens directly (`var(--ds-font-family-base)`),
which cascade from `:root` regardless of DOM position. The listbox styles
do this explicitly rather than relying on inheritance from `:host`.

Severity/error state reuses `ds-input`'s exact `describedBy` pattern
(`aria-invalid`, `aria-describedby` → hint or error id) rather than
reinventing it.

## Design tokens

No new tokens. Reuses existing spacing (`--ds-space-1/2/3/4`), radius
(`--ds-radius-sm/md`), color (`--ds-color-border-default`,
`--ds-color-surface-default/subtle`, `--ds-color-text-default/muted`,
`--ds-color-feedback-error`, `--ds-color-action-primary`), and font
tokens — the same set `ds-input` already uses, since this is another form
control sized to match it.

## Versioning impact

New public component: minor release.

## Adoption and migration

Same discovery path as prior components: public API, Storybook
(`Forms/Dropdown`), `docs/components/dropdown.md`, and
`component-registry.json`. No migration path — no existing select-style
component in the library.

## Open questions

- Grouped options, per-option icons/avatars/tooltips, virtualization, and
  single-line chip overflow are deferred — no confirmed use case yet.
- The `document:click`/`window:scroll`/`window:resize` listeners that
  keep the portal-positioned listbox correctly placed don't cover every
  possible ancestor scroll container (only the window scrolling, and
  clicks anywhere in the document). A nested scrollable ancestor scrolling
  independently of the window could leave the listbox visually
  misaligned from its trigger — a real, known gap `@angular/cdk`'s
  Overlay scroll-strategies exist to solve properly; out of scope until a
  concrete case needs it.
