# Dropdown

## Purpose

Use Dropdown for quick value selection from a short list (5-8 options)
where an action is initiated based on the selection — one value or
several. For a large or dynamically-loaded dataset, this isn't the right
component yet (see Versioning below).

## Usage

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
options: DropdownOption<string>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
];
```

Implements `ControlValueAccessor` — use `[(ngModel)]` or reactive forms,
same as `ds-input`.

## API

| Input | Values | Default | Description |
|---|---|---|---|
| `options` | `DropdownOption<T>[]` | *required* | The list to choose from |
| `label` | `string` | *required* | Visible label |
| `placeholder` | `string` | `''` | Shown when nothing is selected |
| `multiple` | `true`, `false` | `false` | Select one value or several |
| `searchable` | `true`, `false` | `false` | Filter options by typing |
| `clearable` | `true`, `false` | `false` | Shows a clear-selection button |
| `size` | `small`, `medium`, `large` | `medium` | Matches `ds-input`'s sizes |
| `disabled` | `true`, `false` | `false` | |
| `readonly` | `true`, `false` | `false` | Focusable, but the menu can't open |
| `error` | `string \| null` | `null` | Shows an error message, sets `aria-invalid` |
| `hint` | `string \| null` | `null` | Shows a hint message |
| `autoFocus` | `true`, `false` | `false` | Focuses the trigger on init |
| `ariaLabel` | `string \| null` | `null` | Overrides the computed accessible name |
| `menuAriaLabel` | `string \| null` | `null` | Accessible name for the popup listbox |
| `clearAriaLabel` | `string` | `'Clear selection'` | Accessible name for the clear button |

CVA value: `T | null` when `multiple` is `false`, `T[]` when `true` — the
same duality native `<select multiple>` has.

## Accessibility

- Trigger is a real `<button type="button">` (`aria-haspopup="listbox"`)
  when not searchable, or a real `<input type="text">` acting as an
  editable combobox (`role="combobox"`, `aria-autocomplete="list"`) when
  `searchable` is `true`. Both carry `aria-expanded`/`aria-controls`, and
  `aria-activedescendant` while the menu is open.
- Real DOM focus stays on the trigger at all times — the highlighted
  option is tracked via `aria-activedescendant`, not by moving focus into
  the popup.
- Keyboard: ArrowUp/ArrowDown open the menu or move the highlighted
  option; Home/End jump to first/last; Enter (and Space when not
  searchable) commit the highlighted option; Escape closes without
  changing the selection. Typeahead (jump to an option by its first
  letter) works when not searchable.
- The popup listbox is rendered as a child of `document.body` at runtime,
  not in place — this avoids it being visually clipped by an ancestor
  with `overflow: hidden`/`auto`, or trapped by an ancestor with any
  `transform` (both of which happen inside Storybook's own docs page).
  This is intentional, not a leak — Angular tracks the view by internal
  references, not DOM position, so it's cleaned up correctly.
- Multi-select chips are real `ds-tag[dismissible]` instances, so they're
  focusable buttons with `dismissLabel`-driven accessible names, not
  decorative markup.
- `error`/`hint` use the same `aria-invalid`/`aria-describedby` pattern as
  `ds-input`.

## Versioning

Adding a new input is a minor release. Removing/renaming an input or
changing the CVA value shape is a breaking change.

Grouped options, per-option icons/avatars/tooltips, virtualization, and
single-line chip overflow ("+N more") are explicitly out of scope for
this version — see [RFC 005](../governance/rfcs/005-dropdown.md) for why,
and open an RFC if a concrete use case needs one of them.
