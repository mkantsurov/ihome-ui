import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {PowerConsumption} from '../../../../domain/power-consumption';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-power-consumption-chart',
  templateUrl: './power-consumption-chart.component.html',
  styleUrls: ['./power-consumption-chart.component.css'],
  imports: [
    MatProgressSpinner
  ],
  standalone: true
})
export class PowerConsumptionChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() data!: PowerConsumption;

  isLoaded = false;

  showSpinner = true;

  chart: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.info('Initializing power consumption chart...');
    if (changes.data && this.data) {
      console.info('Initializing power consumption chart...');
      this.isLoaded = true;
      this.changeDetectorRef.detectChanges();
      this.initChart(this.data);
    }
  }

  ngOnInit(): void {
  }

  initChart(data: PowerConsumption) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
    const timeArray = data.extConsumption.map(el => new Date(el.dt));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
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
    }
}


