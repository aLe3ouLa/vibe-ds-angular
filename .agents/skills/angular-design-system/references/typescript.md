# TypeScript Design Principles

Use TypeScript to model domain constraints and make invalid states difficult to represent.

## Inference

Prefer inference when the inferred type is accurate.

```ts
const users = getUsers();
```

Do not add annotations without a reason.

Annotations remain useful for:

* public APIs
* exported values
* domain declarations
* preventing undesirable inference
* documenting important contracts

## Narrowing

Prefer control-flow narrowing:

```ts
if (value === 'loading') {
  // narrowed
}
```

over assertions:

```ts
(value as LoadingState)
```

## Assertions

Treat assertions as a signal to investigate.

```ts
value as User
```

Ask what guarantees the assertion is correct.

## Unknown

Use `unknown` for untrusted values.

```ts
const response: unknown = await fetchData();
```

Then validate or narrow.

## Discriminated Unions

Use discriminated unions when a state has mutually exclusive variants.

```ts
type Result =
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: Error }
  | { status: 'loading' };
```

## Exhaustiveness

Use `never` where exhaustive handling matters.

```ts
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

## Generics

A generic should express a relationship.

Good:

```ts
function identity<T>(value: T): T {
  return value;
}
```

Question generics that don't affect relationships between inputs and outputs.

## `satisfies`

Use `satisfies` when you want validation while preserving useful inference.

```ts
const config = {
  primary: {
    label: 'Primary',
  },
} satisfies Record<string, ButtonConfig>;
```

## Derived Types

Prefer a runtime source of truth when appropriate:

```ts
const variants = ['primary', 'secondary'] as const;

type Variant = typeof variants[number];
```

## Readonly

Use readonly types when immutability is part of the contract.

```ts
readonly User[]
```

Do not add readonly everywhere without a reason.

## Complexity

Advanced TypeScript is justified when it solves a real problem.

Avoid:

* unnecessary conditional types
* deep recursive types
* excessive mapped types
* generic abstractions without relationships
* cleverness for its own sake

The type system should improve the developer experience, not become the problem.
