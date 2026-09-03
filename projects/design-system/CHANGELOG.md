# @alexandra/design-system

## 0.4.0

### Minor Changes

- [#10](https://github.com/aLe3ouLa/vibe-ds-angular/pull/10) [`c37f262`](https://github.com/aLe3ouLa/vibe-ds-angular/commit/c37f2627fb276937db5733eb0bdd53c1415e7fda) Thanks [@aLe3ouLa](https://github.com/aLe3ouLa)! - Add `ds-alert-banner` with `variant` (`error`/`warning`/`success`/`info`),
  a required `message`, an optional dismiss button (`dismissible`,
  `dismissLabel`, `dismissed` output), and two named action slots
  (`slot="primary-action"`/`slot="secondary-action"`) for projecting
  `ds-button` actions. No new design tokens — reuses `ds-tag`'s existing
  feedback color pairing.

- [#12](https://github.com/aLe3ouLa/vibe-ds-angular/pull/12) [`2406a2e`](https://github.com/aLe3ouLa/vibe-ds-angular/commit/2406a2e9155d1bfb816da42cc3a76de540441ba1) Thanks [@aLe3ouLa](https://github.com/aLe3ouLa)! - Add `ds-dropdown` — single/multi select from a short list of options.
  Supports `searchable` filtering, `clearable`, three `size`s, `disabled`/
  `readonly`/`error`/`hint` states, and implements `ControlValueAccessor`.
  Multi-select values render as dismissible `ds-tag` chips. No new design
  tokens — reuses `ds-input`'s existing spacing/color/radius/font tokens.

- [#10](https://github.com/aLe3ouLa/vibe-ds-angular/pull/10) [`c37f262`](https://github.com/aLe3ouLa/vibe-ds-angular/commit/c37f2627fb276937db5733eb0bdd53c1415e7fda) Thanks [@aLe3ouLa](https://github.com/aLe3ouLa)! - Adds an alert banner to the DS

- [#13](https://github.com/aLe3ouLa/vibe-ds-angular/pull/13) [`5ba876a`](https://github.com/aLe3ouLa/vibe-ds-angular/commit/5ba876a37efc3c1c3c72742b1bb89aa07f523a8e) Thanks [@aLe3ouLa](https://github.com/aLe3ouLa)! - Add `ds-table` and `ds-empty-state`.

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

## 0.3.0

### Minor Changes

- [#6](https://github.com/aLe3ouLa/vibe-ds-angular/pull/6) [`bffcf56`](https://github.com/aLe3ouLa/vibe-ds-angular/commit/bffcf56fe0c591d5dd6119e9a8c730a28845501c) Thanks [@aLe3ouLa](https://github.com/aLe3ouLa)! - Add `ds-tag` with `variant` (`neutral`/`success`/`error`/`warning`/`info`)
  and an optional dismiss button (`dismissible`, `dismissLabel`,
  `dismissed` output). Adds two new design tokens,
  `--ds-color-feedback-warning` and `--ds-color-feedback-info`, to support
  the new variants.

## 0.2.0

### Minor Changes

- [#4](https://github.com/aLe3ouLa/vibe-ds-angular/pull/4) [`299e7e6`](https://github.com/aLe3ouLa/vibe-ds-angular/commit/299e7e6df7d1181de6a5a0b0a797dd6b31a2993e) Thanks [@aLe3ouLa](https://github.com/aLe3ouLa)! - Add `ds-card`, a content container with `variant` (`default`/`subtle`) and
  `padding` (`sm`/`md`/`lg`). See RFC 002 for what's deferred (elevation,
  header/footer slots, clickable cards).

## 0.1.0

### Minor Changes

- [#1](https://github.com/aLe3ouLa/vibe-ds-angular/pull/1) [`e88a4f9`](https://github.com/aLe3ouLa/vibe-ds-angular/commit/e88a4f9e3c771596053a748963d1b70c7efcda23) Thanks [@aLe3ouLa](https://github.com/aLe3ouLa)! - Add a variant ghost to the button component

## 0.0.2

### Patch Changes

- Move design token source of truth to DTCG JSON (`tokens/*.tokens.json`),
  built into `_primitives.scss` / `_semantic.scss` via Style Dictionary. No
  change to the resolved CSS custom property values or the public API.
