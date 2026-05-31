import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
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
export class PowerVoltageChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() data!: PowerVoltage;

  isLoaded = false;

  showSpinner = true;

  chart: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && this.data) {
      console.info('Initializing temp-chart...');
      this.isLoaded = true;
      this.changeDetectorRef.detectChanges();
      this.initChart(this.data);
    }
  }

  ngOnInit(): void {
  }

  initChart(data: PowerVoltage) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
    const timeArray = data.extVoltage.map(el => new Date(el.dt));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
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
    }
}
