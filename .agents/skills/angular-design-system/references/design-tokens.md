# Design Token Guidelines

Design tokens are part of the design-system contract.

## Token Layers

Distinguish between:

### Primitive tokens

Raw values:

```text
blue-600
spacing-4
font-size-300
```

### Semantic tokens

Meaning:

```text
color-action-primary
color-surface-default
color-text-primary
```

### Component tokens

Component-specific intent:

```text
button-primary-background
button-primary-text
button-border-radius
```

Prefer semantic meaning over raw values in component implementations.

## Avoid Hardcoded Values

Be suspicious of:

```css
background: #2563eb;
padding: 12px;
border-radius: 6px;
```

when equivalent design tokens exist.

## Naming

Names should describe purpose rather than implementation.

Prefer:

```text
color-text-primary
```

over:

```text
gray-900
```

## Themes

Review whether tokens support:

* light theme
* dark theme
* high contrast
* future themes

Do not hardcode assumptions about a single visual theme.

## Component Customization

Prefer controlled component tokens over arbitrary CSS inputs.

Avoid making consumers depend on internal DOM selectors.

## Type Safety

Where tokens are represented in TypeScript, consider deriving types from the token source of truth rather than duplicating token names manually.
