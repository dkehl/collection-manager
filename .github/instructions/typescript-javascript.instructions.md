---
name: TypeScript and JavaScript Coding Patterns
description: "Use when creating or editing TypeScript or JavaScript files. Covers JavaScript and TypeScript conventions, comments, exports, imports, and React components."
applyTo:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
  - "**/*.mts"
  - "**/*.cts"
  - "**/*.mjs"
  - "**/*.cjs"
---

# TypeScript and JavaScript Patterns

- Declare functions as `const` arrow functions unless an existing framework or repository convention requires declarations.
- Add concise, descriptive comments to exported functions, classes, components, types, interfaces, and non-obvious implementation details.
- Document type and interface properties when their purpose is not clear from the name.
- Put module exports at the end of the file. Define functions, classes, constants, types, and interfaces before exporting them.
- Use a final named export block for named values and types:

  ```ts
  const formatName = (name: string) => name.trim();
  type Name = string;

  export { formatName };
  export type { Name };
  ```

- For a default export, define the value as a `const` arrow function first and export it at the end:

  ```ts
  const Component = () => <div />;

  export { Component as default };
  ```

- Put multiple named imports from one module on separate lines within a multiline import block:

  ```ts
  import {
    getUser,
    updateUser,
  } from "./user-service";
  ```

- Put function parameters on separate lines when a function has multiple parameters.
- When a function has two or more optional parameters, prefer a named arguments type and one destructured arguments object. Include all arguments in the named type and define defaults in a named `{functionName}_DEFAULT_ARGS` constant where reuse is useful.

  ```ts
  type GetUserArgs = {
    userId: string;
    includeDeleted?: boolean;
    includeRelations?: boolean;
  };

  const GET_USER_DEFAULT_ARGS = {
    includeDeleted: false,
    includeRelations: false,
  };

  const getUser = ({
    userId,
    includeDeleted = GET_USER_DEFAULT_ARGS.includeDeleted,
    includeRelations = GET_USER_DEFAULT_ARGS.includeRelations,
  }: GetUserArgs) => fetchUser(userId, { includeDeleted, includeRelations });
  ```

- When validating external or untrusted input with Zod or another schema library, preserve unknown-key reporting appropriate to the application and do not silently strip or accept unexpected fields unless that behavior is intentional and documented.
- Do not hardcode secrets or expose server-only credentials through public environment variables.

## React and JSX

- Place reusable Next.js UI components in `src/lib/ui/` and name them after the component or UI concept.
- Keep route-specific composition in `src/app/<route>/`; extract reusable controls and presentations into `src/lib/ui/`.
- Define a named props type or interface for components with props.
- Structure component props in this order: destructure props, apply named defaults, resolve state, execute effects, and render output.
- Destructure props in the function signature and preserve the prop names.
- Define component defaults in named constants; do not repeat inline literals across the component and its call sites.
- Ensure every prop is defaulted or handled safely when `undefined`.
- Follow the existing state-management, styling, routing, and component-file conventions of the repository rather than introducing a new pattern.
