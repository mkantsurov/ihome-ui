import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {SystemStat} from '../../../../domain/systemstat';
import {Chart, Legend, LineController, LineElement, PointElement, LinearScale, TimeScale, Title} from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
    selector: 'app-system-chart',
    templateUrl: './system-chart.component.html',
    styleUrls: ['./system-chart.component.css'],
    standalone: true,
    imports: [
        MatProgressSpinnerModule
    ]
})
export class SystemChartComponent {
  data = input.required<SystemStat>();

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
          label: 'Heap Max',
          fill: false,
          backgroundColor: '#790b8e',
          borderColor: '#790b8e',
          pointRadius: 1,
          data: data.heapMax.map(el => ({
            x: new Date(el.dt),
            y: Number(el.value.toFixed(2))
          })),
        }, {
          label: 'Heap Usage',
          fill: false,
          backgroundColor: '#854492',
          borderColor: '#854492',
          pointRadius: 1,
          data: data.heapUsage.map(el => ({
            x: new Date(el.dt),
            y: Number(el.value.toFixed(2))
          })),
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
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'MB'
            }
          }
        },
      }
    });
    });
    }
}
