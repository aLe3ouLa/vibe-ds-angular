---

name: angular-design-system
description: Review, design, and improve Angular design-system components using type-driven API design, Angular best practices, Storybook, design tokens, accessibility, and maintainability principles. Use when creating, reviewing, refactoring, or extending reusable Angular components.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Angular Design System

You are reviewing or designing components for a reusable Angular design system.

Your primary goal is:

> Make the correct usage easy and the incorrect usage difficult.

A design-system component is not just UI code. Its public API is a contract with every consumer of the system.

Prioritize:

1. API correctness
2. Type safety
3. Accessibility
4. Consistency
5. Composability
6. Developer experience
7. Maintainability
8. Runtime performance

Avoid unnecessary abstraction and cleverness.

---

# Workflow

For every task:

1. Understand the component's purpose and domain.
2. Inspect existing design-system conventions.
3. Inspect similar components before introducing a new pattern.
4. Identify the public API.
5. Identify valid and invalid states.
6. Review the TypeScript model.
7. Review Angular implementation.
8. Review templates.
9. Review Storybook stories.
10. Review accessibility.
11. Run automated checks.
12. Recommend the smallest change that materially improves the component.

Do not introduce a new pattern when an existing design-system convention already solves the problem.

---

# 1. Component API Design

Treat every public component API as a contract.

Review:

* inputs
* outputs
* content projection
* template usage
* public methods
* CSS/customization APIs
* variants
* states
* defaults

Ask:

> Can a consumer use this component incorrectly while still satisfying the TypeScript compiler?

If yes, investigate whether the API can encode the constraint.

---

# 2. Make Invalid States Unrepresentable

Prefer modeling valid states explicitly.

Avoid APIs where several independent properties create invalid combinations.

For example, avoid:

```ts
type ButtonConfig = {
  loading?: boolean;
  disabled?: boolean;
  error?: boolean;
};
```

if those states are mutually exclusive.

Consider:

```ts
type ButtonState =
  | { state: 'default' }
  | { state: 'loading' }
  | { state: 'disabled' }
  | { state: 'error' };
```

Do not introduce discriminated unions merely because they are sophisticated.

First establish that the states actually have meaningful constraints.

---

# 3. TypeScript Principles

Apply type-driven design.

Prefer:

* precise types
* inference
* narrowing
* discriminated unions
* exhaustive checking
* generic relationships
* `unknown` at trust boundaries
* `satisfies` where it improves validation and inference

Avoid:

* unnecessary `any`
* unnecessary type assertions
* unnecessary non-null assertions
* broad string types
* duplicated type definitions
* generics without meaningful relationships
* clever conditional types without a concrete benefit

Ask:

> What incorrect usage does this type prevent?

If there is no useful answer, question the complexity.

Read `references/typescript.md` for detailed guidance.

---

# 4. Angular API Design

Review Angular APIs according to the version and conventions already used by the repository.

Inspect:

* `@Input()`
* `@Output()`
* signal inputs
* signal outputs
* computed state
* content projection
* dependency injection
* standalone components
* host bindings
* host listeners
* template control flow
* change detection
* lifecycle hooks

Prefer the repository's established Angular patterns over introducing new syntax solely because it is newer.

Do not mix competing Angular patterns without a reason.

---

# 5. Inputs

Inputs should communicate what the component accepts.

Prefer precise domain types.

Avoid:

```ts
@Input() variant: string;
```

when the component has a finite set of variants.

Prefer:

```ts
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary';

@Input() variant: ButtonVariant = 'primary';
```

Consider whether related inputs should instead form a discriminated union.

Also review whether an input should be:

* required
* optional
* derived
* computed
* represented by content projection

Do not expose inputs merely because the internal implementation currently needs them.

---

# 6. Outputs

Outputs form part of the public API.

Review:

* event naming
* payload types
* unnecessary payloads
* consistency with neighboring components
* whether the event can be avoided through composition

Prefer:

```ts
@Output() valueChange =
  new EventEmitter<string>();
```

over:

```ts
@Output() valueChange =
  new EventEmitter<any>();
```

Events should communicate exactly what consumers receive.

---

# 7. Generics

Use generics when they express a meaningful relationship.

Good:

```ts
interface SelectOption<T> {
  value: T;
  label: string;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T;
}
```

The generic connects:

```text
option.value
      ↓
component.value
```

Avoid generics that add complexity without expressing a useful relationship.

---

# 8. Derived Types

Prefer deriving types from existing sources of truth.

Avoid:

```ts
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary';

const variants = [
  'primary',
  'secondary',
  'tertiary',
] as const;
```

when one can be the source of truth.

Consider:

```ts
const variants = [
  'primary',
  'secondary',
  'tertiary',
] as const;

type ButtonVariant =
  (typeof variants)[number];
```

Use this only when the runtime value and type genuinely represent the same domain.

---

# 9. `satisfies`

Use `satisfies` when it allows configuration to be checked without unnecessarily widening useful inference.

Example:

```ts
const buttonVariants = {
  primary: {
    emphasis: 'high',
  },
  secondary: {
    emphasis: 'medium',
  },
} satisfies Record<
  ButtonVariant,
  ButtonVariantConfig
>;
```

Prefer this over an annotation when preserving the specific inferred shape is useful.

Do not use `satisfies` merely to demonstrate TypeScript knowledge.

---

# 10. Component Composition

Prefer composition over increasingly complex boolean APIs.

Review APIs such as:

```ts
<ds-card
  [compact]="true"
  [borderless]="true"
  [interactive]="true"
  [loading]="true"
/>
```

Ask whether the component has accumulated too many independent concerns.

Consider:

* composition
* slots/content projection
* separate components
* explicit variants
* state objects

Do not split a component merely because it has multiple inputs.

---

# 11. Content Projection

Use content projection when consumers need to control structure or content.

Review whether APIs such as:

```ts
@Input() title: string;
@Input() description: string;
@Input() icon: string;
@Input() actionLabel: string;
```

are becoming a rigid mini-template.

Consider whether projection provides a better API.

The component should own behavior and structure while allowing consumers appropriate control over content.

---

# 12. Styling and Customization

Prefer design-system tokens and supported customization mechanisms.

Avoid exposing arbitrary implementation details such as:

```ts
@Input() padding: string;
@Input() borderColor: string;
@Input() arbitraryClass: string;
```

unless the design system intentionally supports these APIs.

A reusable component should provide controlled customization rather than allowing consumers to depend on internal CSS.

---

# 13. Design Tokens

Treat tokens as part of the design-system API.

Review:

* naming
* semantic meaning
* primitive vs semantic tokens
* theme support
* dark mode
* spacing
* typography
* color
* motion
* elevation
* component-specific tokens

Prefer semantic tokens:

```text
color.button.primary.background
```

over directly coupling components to primitives:

```text
blue-600
```

Components should generally consume semantic tokens.

Read `references/design-tokens.md`.

---

# 14. Accessibility

Accessibility is a component requirement, not a consumer responsibility.

Review:

* semantic HTML
* accessible names
* roles
* states
* properties
* keyboard interaction
* focus management
* screen-reader behavior
* disabled states
* loading states
* error states
* contrast
* reduced motion

When the `accessibility-review` skill is available, use it for detailed accessibility analysis.

Automated axe results are evidence, not a complete accessibility review.

---

# 15. Storybook

Storybook is part of the component contract.

Stories should communicate meaningful states and usage.

For reusable components, consider stories for:

* default
* variants
* disabled
* loading
* error
* empty
* selected
* focused
* expanded
* icon-only
* long content
* edge cases

Do not create stories solely for exhaustive permutation coverage.

Prefer stories that document meaningful behavior.

Read `references/storybook.md`.

---

# 16. Testing

Review tests at the appropriate level.

Prefer testing:

* public behavior
* user interaction
* emitted events
* accessible behavior
* important state transitions

Avoid tests that couple strongly to implementation details.

A design-system component should have regression tests for important API guarantees.

---

# 17. Performance

Review:

* unnecessary change detection
* expensive template expressions
* repeated computation
* unnecessary subscriptions
* unnecessary DOM
* large component trees
* event listeners
* rendering behavior

Do not optimize prematurely.

Only recommend performance changes when there is a meaningful cost or clear scalability concern.

---

# 18. Public API Surface

A design-system component should expose the smallest useful API.

For every public property ask:

> Does a consumer need this?

For every new option ask:

> Is this a stable design-system concept or an implementation detail?

Avoid API growth caused by individual consumer requirements unless the requirement represents a reusable domain concept.

---

# 19. Consistency

Before creating or changing a component:

Search the repository for similar components.

Compare:

* naming
* inputs
* outputs
* variants
* tokens
* accessibility patterns
* Storybook structure
* testing conventions

Prefer consistency unless there is a documented reason to deviate.

---

# 20. Breaking Changes

Identify whether a proposed change affects consumers.

Consider:

* renamed inputs
* removed inputs
* changed types
* changed defaults
* changed emitted events
* changed DOM structure
* changed CSS hooks
* changed tokens
* changed accessibility behavior

Clearly distinguish:

* breaking change
* additive change
* behavioral change
* internal refactor

---

# Review Output

When reviewing an existing component, report findings in this order:

## Critical

Issues that can cause serious incorrect behavior, broken accessibility, or unsafe APIs.

## High

Issues that materially affect the component's public contract or maintainability.

## Medium

Issues that should be improved but do not immediately threaten correctness.

## Low

Minor consistency or maintainability issues.

## Suggestions

Optional improvements.

For each finding provide:

```text
Severity:
Location:
Problem:
Why it matters:
Recommendation:
Design-system principle:
```

Include code examples when they clarify the recommendation.

---

# Final Questions

Before approving a component, answer:

1. Can consumers use the API incorrectly?
2. Can the type system prevent that misuse?
3. Are the component's states modeled clearly?
4. Is the public API smaller than the implementation?
5. Does the component follow repository conventions?
6. Are design tokens used correctly?
7. Are important states represented in Storybook?
8. Is keyboard interaction correct?
9. Is the component accessible?
10. Are important guarantees covered by tests?
11. Is the implementation simple enough for another engineer to maintain?

The best design-system component is not the most abstract component.

It is the component with a clear contract that makes correct usage obvious.
