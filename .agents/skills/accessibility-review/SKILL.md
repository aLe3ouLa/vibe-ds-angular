---
name: accessibility-review
description: Review web UI implementations for accessibility issues using WCAG 2.2, semantic HTML, keyboard interaction, screen reader behavior, focus management, and accessible naming. Use when reviewing components, pages, pull requests, or UI changes for accessibility.
---

# Accessibility Review

Review the implementation as an accessibility engineer.

The goal is not to mechanically list every possible WCAG criterion. Identify issues that would prevent or significantly hinder people from using the interface, explain why they matter, and provide concrete fixes.

## Review priorities

Review in this order:

1. Semantic HTML
2. Keyboard accessibility
3. Accessible names and descriptions
4. Focus management
5. Screen reader behavior
6. Forms and validation
7. Color and visual presentation
8. Responsive and zoom behavior
9. Motion and animation
10. Automated-test coverage

Prioritize user impact over the number of findings.

## First understand the component

Before reviewing accessibility:

- Identify the component's purpose.
- Identify interactive elements.
- Identify its expected keyboard interaction.
- Identify its state model.
- Identify dynamic content.
- Identify whether it behaves as a known ARIA pattern.
- Determine whether native HTML can solve the problem before recommending ARIA.

Do not assume that adding ARIA automatically improves accessibility.

## Semantic HTML

Prefer native HTML elements whenever possible.

Examples:

- Use `<button>` instead of `<div role="button">`.
- Use `<a href>` for navigation.
- Use `<label>` for form controls.
- Use headings to represent document structure.
- Use lists for lists.
- Use `<nav>`, `<main>`, `<header>`, `<footer>` and other landmarks where appropriate.

Flag unnecessary ARIA when native HTML provides the required semantics.

## Accessible names

Every interactive control must have an accessible name.

Check:

- buttons
- links
- inputs
- selects
- checkboxes
- radios
- custom controls
- icon-only controls

Prefer:

1. Visible text
2. Associated `<label>`
3. Appropriate native naming mechanism
4. `aria-labelledby`
5. `aria-label` when necessary

Do not recommend `aria-label` when visible text already provides the correct name.

For icon-only controls, require an explicit accessible name.

## Keyboard accessibility

All functionality must be usable without a mouse.

Check:

- Tab navigation
- Shift+Tab navigation
- Enter
- Space
- Escape
- Arrow keys where the interaction pattern requires them
- Home/End where appropriate
- Focus visibility
- Focus order
- Keyboard traps

Do not require keyboard users to reproduce mouse-specific interactions.

For custom widgets, compare the interaction with the appropriate WAI-ARIA pattern.

## Focus management

Check both focusability and focus movement.

Pay particular attention to:

- dialogs
- drawers
- popovers
- dropdown menus
- comboboxes
- dynamically inserted content
- route changes
- validation errors

For dialogs:

- Move focus into the dialog when appropriate.
- Keep focus within the modal interaction while it is open.
- Provide a keyboard mechanism to close it.
- Return focus to the triggering element when appropriate.

Do not move focus unnecessarily.

## Screen reader behavior

Evaluate what a screen reader user would perceive.

Check:

- accessible names
- roles
- states
- properties
- relationships
- reading order
- hidden content
- dynamic updates
- duplicate announcements

Be particularly suspicious of visually obvious information that is not represented semantically.

## Forms

For forms, check:

- labels
- required fields
- instructions
- autocomplete
- error identification
- error association
- validation timing
- invalid state
- focus after submission
- grouped controls

Errors should be understandable and programmatically associated with the relevant field.

Avoid relying exclusively on color to communicate errors or required states.

## Color and visual presentation

Check:

- text contrast
- non-text contrast where relevant
- focus indicators
- error/success states
- disabled states
- information conveyed exclusively through color

Do not treat color contrast as the only visual accessibility concern.

## Responsive behavior

Consider:

- browser zoom
- text resizing
- narrow viewports
- reflow
- horizontal scrolling
- touch target size where applicable

A component should remain usable when content becomes larger.

## Motion

Check animations and transitions for:

- unnecessary motion
- flashing
- auto-playing animation
- ability to pause/stop where required
- `prefers-reduced-motion`

Prefer respecting:

```css
@media (prefers-reduced-motion: reduce) {
  ...
}