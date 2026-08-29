# Changesets

This directory tracks pending changes to `@alexandra/design-system` between
releases.

## Adding a changeset

When your PR changes the library's public API or behavior, add a changeset:

```bash
npx changeset add
```

Pick `patch` / `minor` / `major` per [Decision 001](../docs/governance/decisions/001-button.md)'s
versioning rules (adding is minor, removing/renaming a public input is major)
and write a one-line summary — this becomes the CHANGELOG entry.

## Releasing

```bash
npx changeset version
```

Consumes every pending changeset, bumps
`projects/design-system/package.json`, and writes
`projects/design-system/CHANGELOG.md`. Commit the result.

See https://github.com/changesets/changesets for full documentation.
