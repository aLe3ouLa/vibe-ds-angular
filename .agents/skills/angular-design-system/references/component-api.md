# Component API Design

A design-system component API should expose stable domain concepts rather than implementation details.

## API Review

For every public property ask:

* Is it necessary?
* Is its type precise?
* Can it create an invalid state?
* Is the default meaningful?
* Is it consistent with neighboring components?
* Does it belong in the public API?

## Boolean Explosion

Be suspicious of multiple booleans:

```ts
disabled?: boolean;
loading?: boolean;
selected?: boolean;
error?: boolean;
```

If combinations have different meanings or are mutually exclusive, consider an explicit state model.

## Variants

Prefer finite unions for finite domains:

```ts
type Variant =
  | 'primary'
  | 'secondary'
  | 'tertiary';
```

Avoid:

```ts
variant: string;
```

when arbitrary values are not valid.

## Public API vs Implementation

Do not expose internal implementation concerns merely because they are configurable.

Examples of potentially problematic APIs:

```ts
@Input() internalPadding
@Input() wrapperClass
@Input() iconSize
@Input() animationDuration
```

unless these are intentional design-system concepts.

## Composition

When a component accumulates many configuration properties, investigate composition.

Prefer:

```html
<ds-card>
  <ds-card-header>
    ...
  </ds-card-header>

  <ds-card-content>
    ...
  </ds-card-content>
</ds-card>
```

when consumers need structural control.

## Consumer Experience

Evaluate APIs from the perspective of the consuming developer.

A good API should provide:

* useful autocomplete
* meaningful compiler errors
* sensible defaults
* predictable events
* minimal required configuration
* discoverable variants
* accessible behavior by default
