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
- **`Number()` wrapper for `.toFixed()`**: When calling `.toFixed()` on a numeric value, wrap the result in `Number()` to ensure proper typing: `Number(value.toFixed(2))`.
- Keep Angular package versions aligned across `@angular/*` dependencies.
- Preserve module structure and routing style already used in `src/app`.
- Favor strongly typed interfaces/models in `src/app/domain` when adding new data structures.
- Use existing services/interceptors/guards patterns instead of creating parallel implementations.
- **Do NOT use `@Input()` decorator + plain property for data that comes from subscriptions**. Use `signal()` with `.set()` instead.

## Signal-based state management (current pattern)
All `*Stat` data properties and other state set via subscriptions use Angular Signals:

### Declaration pattern
```typescript
import {Component, OnInit, signal} from '@angular/core';

// For domain interfaces with array properties:
myStat = signal<MyStatType>({
  fieldName: [{ dt: new Date(), value: 0 }]
});

// For simple domain interfaces:
mySummary = signal<MySummaryType>({
  field1: 0,
  field2: ''
});
```

### Assignment in subscriptions
Use `.set()` (not `=`) to update signal values:
```typescript
ngOnInit(): void {
  this.systemService.getSomeData().subscribe(response => {
    this.myStat.set(response);
  });
}
```

### Template unwrapping
- For `[data]` bindings passing to child chart components (which use `input.required<Type>()`): `[data]="myStat()"`
- For `{{ }}` interpolation: `{{ mySummary().fieldName }}`

## Chart component patterns (Angular 21, signal-based)
All chart components follow these conventions:
- **Standalone**: `standalone: true` with `imports` array.
- **Loading state**: Use `@if (isLoaded) { <canvas> } @else { <mat-spinner> }` in the template (no `[hidden]`).
- **MatProgressSpinner import**: Import `MatProgressSpinner` (the standalone directive from `@angular/material/progress-spinner`) and add it to the `imports` array. The older `MatProgressSpinnerModule` also works.
- **Canvas ref**: Use `viewChild<ElementRef<HTMLCanvasElement>>('canvas')` (not `@ViewChild`).
- **Input data**: Use `data = input.required<SomeType>()` (not `@Input() data!: SomeType`).
- **Reactive update**: Chart is rebuilt in `effect()` when `data()` signal input changes (not `ngOnChanges()`).
- **Chart.js registration**: `Chart.register(...)` is called in the constructor with specific controllers, elements, and scales.
- **Chart destruction**: Destroy previous chart instance before creating a new one inside `effect()`.

### Standard chart component template
```typescript
import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {Chart, Legend, LineController, LineElement, PointElement, LinearScale, TimeScale, Title} from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {SomeType} from '../../domain/some-type';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-some-chart',
  templateUrl: './some-chart.component.html',
  styleUrls: ['./some-chart.component.css'],
  imports: [MatProgressSpinner],
  standalone: true
})
export class SomeChartComponent {
  data = input.required<SomeType>();
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  isLoaded = false;
  // eslint-disable-next-line
  chart: any = null;

  constructor() {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Legend);
    effect(() => {
      const data = this.data();

      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }

      this.isLoaded = true;

      const canvasRef = this.canvas();
      if (!canvasRef) return;

      this.chart = new Chart(canvasRef.nativeElement, {
        type: 'line',
        data: {
          datasets: [{
            label: 'Some Label',
            data: data.someField.map(el => ({
              x: new Date(el.dt),
              y: Number((el.value * 0.01).toFixed(2))
            })),
            borderColor: '#bb3b01',
            backgroundColor: 'transparent',
            pointRadius: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: { enabled: true, mode: 'point', intersect: true }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
                stepSize: 2,
                displayFormats: { hour: 'MMM DD hA' }
              },
              title: { display: true, text: 'Time' }
            },
            y: { title: { display: true, text: 'Value' } }
          },
        }
      });
    });
  }
}
```

### Child component usage in parent templates
When passing data to chart components, unwrap the signal with `()`:
```html
<app-some-chart [data]="myStat()"></app-some-chart>
```

## Editing guidelines
- Prefer minimal, targeted changes over broad refactors.
- Preserve existing naming and folder conventions.
- Keep imports sorted consistently with surrounding code.
- Avoid introducing new libraries unless explicitly requested.
- Do not change generated build artifacts under `build/` unless requested.

## Validation checklist after code changes
Run these commands from project root:
```shell
npx ng build
```

