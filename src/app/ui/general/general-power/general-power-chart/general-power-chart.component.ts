import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {PowerVoltageExt} from '../../../../domain/power-voltage-ext';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
@Component({
  selector: 'app-general-power-chart',
  templateUrl: './general-power-chart.component.html',
  styleUrls: ['./general-power-chart.component.css'],
  imports: [
    MatProgressSpinner
  ],
  standalone: true
})
export class GeneralPowerChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() data!: PowerVoltageExt;

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

  initChart(data: PowerVoltageExt) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.extVoltage.map(el => new Date(el.dt)),
        datasets: [{
          label: 'Power',
          data: data.extVoltage.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.1).toFixed(1))
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
              text: 'Power'
            },
            suggestedMin: 0,
            beginAtZero: true
          }
        },
      },

    });
    }


}
