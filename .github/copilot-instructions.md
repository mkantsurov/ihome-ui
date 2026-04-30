# Copilot Instructions for `ihome-ui`

## Project context
- This is an Angular frontend project in `/opt/projects/ihome/ihome-ui`.
- Build/runtime tooling is primarily Node + Angular CLI, with Gradle wrapper integration for packaging/deployment tasks.
- Main app source is under `src/app`.

## Tech stack
- Angular `20.x` (`@angular/*`)
- TypeScript `5.8.x`
- Angular Material + CDK
- RxJS `6.6.x`
- Karma + Jasmine for unit tests
- TSLint is still present in this codebase (do not auto-migrate linters unless asked)

## Editing guidelines
- Prefer minimal, targeted changes over broad refactors.
- Preserve existing naming and folder conventions.
- Keep imports sorted consistently with surrounding code.
- Avoid introducing new libraries unless explicitly requested.
- Do not change generated build artifacts under `build/` unless requested.

## Angular-specific guidance
- Keep Angular package versions aligned across `@angular/*` dependencies.
- Preserve module structure and routing style already used in `src/app`.
- Favor strongly typed interfaces/models in `src/app/domain` when adding new data structures.
- Use existing services/interceptors/guards patterns instead of creating parallel implementations.

## Validation checklist after code changes
Run these commands from project root:

```bash
npm run lint
npm run test -- --watch=false --browsers=ChromeHeadless
npm run build
```

If a change is config/build related, also run:

```bash
gradle --no-daemon tasks
```

## Output expectations for Copilot
- Include changed file paths in responses.
- Briefly explain why each change is needed.
- Call out potential risks/regressions when touching routing, auth (`jwt-interceptor`), or shared services.
- Suggest follow-up verification steps when behavior changes.

