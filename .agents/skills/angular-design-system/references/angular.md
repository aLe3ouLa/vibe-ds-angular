# Angular Design Principles

Follow the Angular version and conventions already established by the repository.

## Components

Prefer focused components with a clear responsibility.

Review:

* inputs
* outputs
* template
* styling
* dependencies
* state
* accessibility

## Signals

When the repository uses signals, understand whether state should be:

* writable
* computed
* derived
* input-driven

Avoid duplicating derived state.

Prefer:

```ts
readonly fullName = computed(
  () => `${this.firstName()} ${this.lastName()}`
);
```

over manually synchronizing duplicated state.

## Inputs

Inputs should have precise types.

Prefer required inputs where a component cannot function meaningfully without the value.

Do not make every input optional merely to simplify component construction.

## Outputs

Outputs should represent meaningful user or domain events.

Avoid leaking internal implementation events.

## Templates

Review:

* semantic HTML
* control flow
* event handling
* unnecessary function calls
* duplicated logic
* accessibility attributes
* template type safety

Keep complex business logic out of templates.

## Dependency Injection

Inject only what the component needs.

Prefer established repository patterns for services and tokens.

## Content Projection

Use projection when consumers need structural control.

Do not turn every configurable value into an input.

## Change Detection

Understand the project's change-detection strategy before recommending changes.

Avoid premature optimization.

## Angular-Specific API Design

Consider whether functionality belongs in:

* component inputs
* component outputs
* content projection
* directives
* services
* pipes
* utility functions

Choose based on responsibility rather than convenience.
