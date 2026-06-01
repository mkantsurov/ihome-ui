import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {Chart, Legend, LineController, LineElement, PointElement, LinearScale, Title, TimeScale} from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {LaStat} from '../../../../domain/lastat';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
    selector: 'app-system-chart-la',
    templateUrl: './system-chart-la.component.html',
    styleUrls: ['./system-chart-la.component.css'],
    standalone: true,
    imports: [
        MatProgressSpinnerModule
    ]
})
export class SystemChartLaComponent {
  data = input.required<LaStat>();

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
          label: 'LA',
          data: data.la.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.01).toFixed(2))
          })),
          backgroundColor: '#bb3b01',
          pointRadius: 1
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
              text: 'LA'
            }
          }
        },
      }
    });
    });
    }
}
