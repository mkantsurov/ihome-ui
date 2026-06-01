import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {Chart, Legend, LineController, LineElement, LinearScale, PointElement, TimeScale, Title} from 'chart.js';
import 'chartjs-adapter-dayjs-3';
import {PowerConsumption} from '../../../../domain/power-consumption';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-power-consumption-chart',
  templateUrl: './power-consumption-chart.component.html',
  styleUrls: ['./power-consumption-chart.component.css'],
  imports: [
    MatProgressSpinner
  ],
  standalone: true
})
export class PowerConsumptionChartComponent {
  data = input.required<PowerConsumption>();

  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  isLoaded = false;

  // eslint-disable-next-line
  chartInstance: any = null;

  constructor() {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Legend);
    effect(() => {
      const data = this.data();

      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }

      this.isLoaded = true;

      const canvasRef = this.canvas();
      if (!canvasRef) return;

      this.chartInstance = new Chart(canvasRef.nativeElement, {
        type: 'line',
        data: {
          datasets: [{
            label: 'Ext Consumption',
            data: data.extConsumption.map(el => ({
              x: new Date(el.dt),
              y: el.value
            })),
            backgroundColor: 'transparent',
            borderColor: '#2E4895',
            pointRadius: 1
          }, {
            label: 'Int Consumption',
            data: data.intConsumption.map(el => ({
              x: new Date(el.dt),
              y: el.value
            })),
            backgroundColor: 'transparent',
            borderColor: '#854492',
            pointRadius: 1
          }, {
            label: 'Int Bck Consumption',
            data: data.intBckConsumption.map(el => ({
              x: new Date(el.dt),
              y: el.value
            })),
            backgroundColor: 'transparent',
            borderColor: '#790b8e',
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
                text: 'Consumption'
              },
              suggestedMin: 0,
              beginAtZero: true
            },
          },
        },
      });
    });
  }
}


