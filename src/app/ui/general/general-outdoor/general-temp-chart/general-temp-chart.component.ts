import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {OutdoorTempStat} from '../../../../domain/outdoor-temp-stat';
import {Chart, Legend, LineController, LineElement, PointElement, LinearScale, TimeScale, Title} from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-general-temp-chart',
  templateUrl: './general-temp-chart.component.html',
  styleUrls: ['./general-temp-chart.component.css'],
  imports: [
    MatProgressSpinner
  ],
  standalone: true
})
export class GeneralTempChartComponent {
  data = input.required<OutdoorTempStat>();

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
          label: 'Temperature',
          data: data.temperature.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.01).toFixed(2))
          })),
          backgroundColor: 'transparent',
          borderColor: '#476bb9',
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
              text: 'Temperature'
            }
          }
        },
      },
    });
    });
  }
}
