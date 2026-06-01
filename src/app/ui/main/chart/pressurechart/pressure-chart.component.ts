import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {PressureStat} from '../../../../domain/pressurestat';
import {Chart, Legend, LineController, LineElement, PointElement, LinearScale, TimeScale, Title} from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
    selector: 'app-pressure-chart',
    templateUrl: './pressurechart.component.html',
    styleUrls: ['./pressurechart.component.css'],
    standalone: true,
    imports: [
        MatProgressSpinnerModule
    ]
})
export class PressureChartComponent {

  data = input.required<PressureStat>();

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
          label: 'Pressure',
            data: data.pressure.map(el => ({
              x: new Date(el.dt),
              y: el.value
            })),
          borderColor: 'rgba(255,153,0,0.4)',
            backgroundColor: 'transparent',
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
              text: 'Pressure'
            }
          }
        },
      }
    });
    });
    }
}
