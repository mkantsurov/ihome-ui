# Copilot Instructions for `ihome-ui`

## Project context
- This is an Angular frontend project in `/opt/projects/ihome/ihome-ui`.
- Build/runtime tooling is primarily Node + Angular CLI, with Gradle wrapper integration for packaging/deployment tasks.
- Main app source is under `src/app`.

## Tech stack
- Angular `21.x` (`@angular/*` 21.2.x)
- TypeScript `5.8.x`
- Angular Material + CDK
- RxJS `6.6.x`
- Karma + Jasmine for unit tests
- Chart.js for charting, with `chartjs-adapter-dayjs-3` for time axis support
- TSLint is still present in this codebase (do not auto-migrate linters unless asked)

## Angular-specific guidance
- **Standalone components are the default**: All components SHOULD use `standalone: true`. Angular 21 changed the default from `false` to `true`. Do NOT add `standalone: false` components unless explicitly requested. When using `@NgModule`, standalone components go in the `imports` array (not `declarations`).
- **Use `@if`/`@else` control flow syntax** instead of mixing `[hidden]` with `@if`. For example, replace `[hidden]="!condition"` with `@if (condition) { ... } @else { ... }`.
- **Import Chart.js adapter**: Any component using Chart.js with time scales must include `import 'chartjs-adapter-dayjs-3';` at the top of the `.ts` file.
- **ElementRef typing**: Use `@ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>` (not bare `ElementRef`).
- **Non-null assertions on inputs**: Use `@Input() data!: SomeType` (with `!`) rather than initializing with a stub object.
- **`Number()` wrapper for `.toFixed()`**: When calling `.toFixed()` on a numeric value, wrap the result in `Number()` to ensure proper typing: `Number(value.toFixed(2))`.
- Keep Angular package versions aligned across `@angular/*` dependencies.
- Preserve module structure and routing style already used in `src/app`.
- Favor strongly typed interfaces/models in `src/app/domain` when adding new data structures.
- Use existing services/interceptors/guards patterns instead of creating parallel implementations.

## Chart component patterns (Angular 21)
All chart components follow these conventions:
- **Standalone**: `standalone: true` with `imports` array.
- **Loading state**: Use `@if (isLoaded) { <canvas> } @else { <mat-spinner> }` in the template (no `[hidden]`).
- **MatProgressSpinner import**: Import `MatProgressSpinner` (the standalone directive from `@angular/material/progress-spinner`) and add it to the `imports` array. The older `MatProgressSpinnerModule` also works.
- **Canvas ref**: `@ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>`
- **Input data**: `@Input() data!: <Type>` with non-null assertion.
- **Chart.js init**: Chart is created in `ngOnChanges()` when `@Input() data` changes.
- **Chart.js registration**: `Chart.register(...)` is called in an `initChart()` method with specific controllers, elements, and scales.

## Editing guidelines
- Prefer minimal, targeted changes over broad refactors.
- Preserve existing naming and folder conventions.
- Keep imports sorted consistently with surrounding code.
- Avoid introducing new libraries unless explicitly requested.
- Do not change generated build artifacts under `build/` unless requested.

## Validation checklist after code changes
Run these commands from project root:

