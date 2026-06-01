import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {Chart, Legend, LineController, LineElement, PointElement, LinearScale, TimeScale, Title} from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {PowerVoltage} from '../../../../domain/power-voltage';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-power-voltage-chart',
  templateUrl: './power-voltage-chart.component.html',
  styleUrls: ['./power-voltage-chart.component.css'],
  imports: [
    MatProgressSpinner
  ],
  standalone: true
})
export class PowerVoltageChartComponent {
  data = input.required<PowerVoltage>();

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
          label: 'Ext Voltage',
          data: data.extVoltage.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.1).toFixed(1))
          })),
          backgroundColor: 'transparent',
          borderColor: '#2E4895',
          pointRadius: 1
        }, {
          label: 'Int Voltage',
          data: data.intVoltage.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.1).toFixed(1))
          })),
          backgroundColor: 'transparent',
          borderColor: '#854492',
          pointRadius: 1
        }, {
          label: 'Int Bck Voltage',
          data: data.intBckVoltage.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.1).toFixed(1))
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
              text: 'Voltage'
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
