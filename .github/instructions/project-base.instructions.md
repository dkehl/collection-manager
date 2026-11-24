---
name: Project Coding Base
description: "Use for coding tasks in every project. Covers repository conventions and validation."
applyTo: "**"
---

# Project Coding Base

- Inspect the repository first and follow its existing structure, naming, and conventions.
- When creating a new project, copy the generalized coding-base and TypeScript/JavaScript instruction templates into `.github/instructions/` so the project starts with an explicit local copy of the shared conventions.
- Make focused changes; do not reorganize unrelated code.
- Keep changes complete, typed where applicable, and consistent with the surrounding implementation.
- Prefer established project abstractions and package-manager workflows over ad hoc replacements.
- Update directly related documentation and configuration when behavior or developer setup changes.
- Use the project's own scripts for validation. For example, inspect `package.json`, `Makefile`, or CI configuration and run the smallest relevant test, lint, type-check, and build commands.
- Never commit secrets or credentials. Keep environment-specific secrets in ignored local environment files and commit only safe placeholders.
- Preserve existing public behavior unless the requested change explicitly requires a change.
