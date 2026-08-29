# @alexandra/design-system

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
