import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {Chart, Legend, LineController, LineElement, PointElement, LinearScale, Title, TimeScale} from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {TempStat} from '../../../../domain/tempstat';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-temp-chart',
  templateUrl: './temp-chart.component.html',
  styleUrls: ['./temp-chart.component.css'],
  imports: [
    MatProgressSpinner
  ],
  standalone: true
})
export class TempChartComponent {
  data = input.required<TempStat>();

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
          label: 'Outdoor',
          fill: false,
          backgroundColor: '#e8bc00',
          borderColor: '#e8bc00',
          pointRadius: 1,
          data: data.outdoor.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.01).toFixed(2))
          })),
        }, {
          label: 'Indoor SF',
          fill: false,
          backgroundColor: '#790b8e',
          borderColor: '#790b8e',
          pointRadius: 1,
          data: data.indoorSf.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.01).toFixed(2))
          })),
        }, {
            label: 'Indoor GF',
            fill: false,
            backgroundColor: '#854492',
            borderColor: '#854492',
            pointRadius: 1,
            data: data.indoorGf.map(el => ({
              x: new Date(el.dt),
              y: Number((el.value * 0.01).toFixed(2))
            })),
          }, {
          label: 'Garage',
          fill: false,
          backgroundColor: '#666699',
          borderColor: '#666699',
          pointRadius: 1,
          data: data.garage.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.01).toFixed(2))
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
              text: 'Temperature'
            }
          }
        },
      }
    });
    });
    }
}
