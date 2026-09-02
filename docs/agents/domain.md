# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, if it exists.
- **`docs/governance/decisions/`**: this repo's equivalent of an ADR log — accepted decisions on the design system's public API and their consequences. Read decisions that touch the area you're about to work in.
- **`docs/governance/rfcs/`**: proposals for new or changed public API. Some aren't accepted yet, so treat them as context on open questions rather than settled decisions.

If any of these don't exist yet, proceed silently — don't flag their absence or suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates `CONTEXT.md` lazily when terms actually get resolved.

## File structure

This repo is single-context — `package.json`'s `workspaces` field lists only `projects/design-system` alongside the demo app, not several independent domains:

```
/
├── CONTEXT.md                    ← created lazily by /domain-modeling
└── docs/
    ├── governance/
    │   ├── rfcs/                 ← proposals, some not yet accepted
    │   └── decisions/            ← accepted decisions (this repo's ADR log)
    └── components/                ← component usage docs
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag decision conflicts

If your output contradicts an existing decision record, surface it explicitly rather than silently overriding:

> _Contradicts docs/governance/decisions/006-dropdown.md, but worth reopening because…_

New public components or public-API changes go through the RFC → decision record → `component-registry.json` process described in AGENTS.md/CLAUDE.md — don't propose a breaking change as a silent edit.
