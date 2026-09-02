# Decision 006: Dropdown API

- Status: Accepted
- Date: 2026-09-01
- Owner: Design System Team

## Decision

The public selector is `ds-dropdown`, accepted as proposed in
[RFC 005](../rfcs/005-dropdown.md).

The initial API includes: `options`/`label` (required), `placeholder`,
`multiple`, `searchable`, `clearable`, `size`, `disabled`, `readonly`,
`error`/`hint`, `autoFocus`, and the `ariaLabel`/`menuAriaLabel`/
`clearAriaLabel` accessibility overrides. It implements
`ControlValueAccessor`. No `id` input (generated internally, matching
`ds-input`), no `inputAriaLabel` (one `ariaLabel` covers both trigger
modes), no separate change output beyond CVA.

Deferred, not included: grouped options, per-option icon/avatar/tooltip
slots, virtualization/custom render support, single-line chip overflow
("+N more"). Multi-select chips render as `ds-tag[dismissible]`, reusing
an existing component rather than new chip markup.

No new design tokens — reuses the same spacing/color/radius/font tokens
`ds-input` already uses.

The trigger focus ring and active-option outline use
`--ds-color-action-primary`, matching the established `ds-input` focus
convention. This provides a consistent, recognizable focus treatment across
form controls; the trigger's ring uses the same 35% `color-mix` treatment as
`ds-input`.

## Why

The component was scoped deliberately smaller than a full-featured
reference spec that was used as inspiration, matching this library's
existing pattern of shipping a minimal, correct core and growing by RFC
rather than by speculative API surface (see RFC 005's Alternatives for
each deferred feature and why).

The popup listbox is re-parented to `document.body` at runtime (see
`dropdown.ts`) rather than left as a normal in-place child. This wasn't
the original plan — it was forced by a real bug found during
implementation: Storybook's own docs page clips a plain
`position: absolute`/`position: fixed` popup via an ancestor's
`overflow: auto` combined with a transform-bearing wrapper that traps
even `position: fixed`. Re-parenting to `<body>` avoids the problem
entirely without adding `@angular/cdk`. This is a real, load-bearing part
of the component's implementation now, not an incidental detail — see
RFC 005's Accessibility section for the full explanation, including the
CSS-inheritance consequence it created (fixed by referencing tokens
directly instead of relying on `inherit`).

## Consequences

Changing the selector, changing `value`'s CVA shape, removing/renaming
any input above, or removing the `ControlValueAccessor` implementation
after the first public release is a breaking change.

Adding grouped options, per-option icons, or virtualization later is
additive (minor) as long as the existing inputs above are unchanged.

The `document.body` re-parenting behavior is now part of the component's
contract — a future change back to in-place rendering would need to
re-verify the docs-page clipping scenario doesn't regress.
