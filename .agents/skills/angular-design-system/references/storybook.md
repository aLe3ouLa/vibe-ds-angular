# Storybook Guidelines

Storybook should document the public behavior of a design-system component.

## Story Coverage

Prioritize meaningful states:

* default
* variants
* disabled
* loading
* error
* empty
* selected
* expanded
* focused
* icon-only
* long content
* edge cases

Do not blindly generate every possible permutation.

## Accessibility

Stories should make accessibility issues visible.

Include states that affect:

* accessible names
* descriptions
* focus
* keyboard interaction
* live regions
* disabled/loading behavior

## Controls

Controls should expose meaningful public API properties.

Avoid exposing internal implementation details.

## Story Names

Use names that communicate behavior rather than implementation.

Prefer:

```text
Loading
Disabled
With error
Icon only
```

over:

```text
Test1
Variant2
InternalState
```

## Documentation

A good Storybook entry should answer:

* What is this component?
* When should it be used?
* What variants exist?
* What states exist?
* How is it accessed?
* What are the important interaction rules?

## Testing

Where the repository supports Storybook interaction or accessibility tests, prefer testing public behavior through stories.
