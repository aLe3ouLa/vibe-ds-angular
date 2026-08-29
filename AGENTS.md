# Design System Repository — Agent Instructions

This is the canonical, tool-agnostic instructions file for this repository.
CLAUDE.md, .github/copilot-instructions.md, and any nested CLAUDE.md files
point back here — update this file, not those.

This repository contains an Angular design system: a publishable component
library, a DTCG design token pipeline, Storybook documentation, and a
governance process for changing the public API.

## Repository map

- `projects/design-system/`: publishable Angular library
- `projects/design-system/src/lib/`: component implementations
- `projects/design-system/src/lib/**/*.stories.ts`: Storybook stories
- `projects/design-system/tokens/`: DTCG design token source (`.tokens.json`).
  Edit these, never the generated SCSS.
- `projects/design-system/src/lib/styles/_primitives.scss`,
  `_semantic.scss`: **generated** from `tokens/` by `npm run tokens:build`.
  Do not hand-edit.
- `projects/design-system/component-registry.json`: governance-owned list of
  which components are public, their category, and their status
  (`stable` / `proposed` / `deprecated`).
- `docs/components/`: component usage documentation
- `docs/governance/rfcs/`: proposals for new or changed public API
- `docs/governance/decisions/`: accepted decisions and their consequences
- `tools/design-system-mcp/`: MCP server exposing live component and token
  data to coding agents (see "MCP tools" below)
- `CONTRIBUTING.md`: contribution workflow

## Consumer rules

When building product UI:

1. Search this package before creating custom UI.
2. Check the component documentation and Storybook stories.
3. Prefer existing `ds-*` components.
4. Do not import internal library paths.
5. Propose an RFC (`docs/governance/rfcs/000-template.md`) when no suitable
   component exists.
6. Do not duplicate design tokens in a consuming application — consume
   `@alexandra/design-system` tokens, don't hardcode hex/rem values.

## Angular usage

```ts
import { Button } from '@alexandra/design-system';
```

```html
<ds-button variant="primary">Play</ds-button>
```

## Design tokens

Token values live in `projects/design-system/tokens/*.tokens.json` (DTCG
format: `$type` / `$value`, references as `{color.green.500}`). They build
into generated SCSS via:

```bash
npm run tokens:build
```

This runs automatically before `npm run build` and `npm run build-storybook`.
Only `color` has a semantic aliasing tier (`semantic.tokens.json`); spacing
and radius are exposed directly from primitives with no renaming. Components
consume the semantic tier only, via `var(--ds-*)` — never reference a
primitive SCSS variable (`$color-green-500`) from component code.

## Component governance

A new public component or a change to an existing component's public API
(inputs, outputs, selector) goes through:

1. An RFC in `docs/governance/rfcs/` (copy `000-template.md`).
2. A decision record in `docs/governance/decisions/` once accepted.
3. An entry (or status update) in `component-registry.json`.

Breaking changes (renaming/removing an input, changing the selector) require
a decision record and a major-version bump, not a silent edit.

## MCP tools

`tools/design-system-mcp` runs an MCP server (`.vscode/mcp.json` registers it
as `design-system-discovery`) with three tools backed by real repo state, not
hand-maintained lists:

- `list_components` — the current public component list, from
  `component-registry.json`.
- `get_component_api` — real inputs/outputs/types for one component, read
  from compodoc's generated `documentation.json`. Call this before writing
  any `ds-*` usage instead of guessing prop names.
- `list_tokens` — every resolved semantic design token
  (`--ds-color-...`, `--ds-space-...`, etc.), parsed from the generated
  `_semantic.scss`. Use these instead of hardcoding raw values.

## Validation

Run after changes:

```bash
npm run build
npm run build-storybook
```

Run `npm run tokens:build` after editing any file in `tokens/`.
