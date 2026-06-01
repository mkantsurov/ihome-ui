import {
  ChangeDetectorRef,
  Component, effect,
  ElementRef,
  input,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges, viewChild,
  ViewChild
} from '@angular/core';
import {LuminosityStat} from '../../../../domain/luminositystat';
import {Chart, Legend, LineController, LineElement, PointElement, LinearScale, TimeScale, Title} from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
    selector: 'app-luminosity-chart',
    templateUrl: './luminosity-chart.component.html',
    styleUrls: ['./luminosity-chart.component.css'],
    standalone: true,
    imports: [
        MatProgressSpinnerModule
    ]
})
export class LuminosityChartComponent {
  data = input.required<LuminosityStat>();

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
          label: 'Luminosity',
          data: data.luminosity.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.01).toFixed(2))
          })),
          borderColor: '#e8bc00',
          pointRadius: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: true,
            mode: 'point',
            intersect: true
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
              stepSize: 2,
              displayFormats: {
                hour: 'MMM DD hA',
              }
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Luminosity'
            }
          }
        },
      }
    });
    });
    }
}
