import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
import {PowerConsumption} from '../../../../domain/power-consumption';

@Component({
  selector: 'app-power-consumption-chart',
  templateUrl: './power-consumption-chart.component.html',
  styleUrls: ['./power-consumption-chart.component.css']
})
export class PowerConsumptionChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: PowerConsumption;

  isLoaded = false;

  showSpinner = true;

  chart: any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && this.data) {
      console.info('Initializing temp-chart...');
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
            y: (el.value * 0.1).toFixed(1)
          })),
          backgroundColor: 'transparent',
          borderColor: '#352e95'
        }, {
          label: 'Int Consumption',
          data: data.intConsumption.map(el => ({
            x: new Date(el.dt),
            y: (el.value * 0.1).toFixed(1)
          })),
          backgroundColor: 'transparent',
          borderColor: '#952e90',
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
            suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
            // OR //
            beginAtZero: true,   // minimum value will be 0.
          },
        },
      },

    });
    this.isLoaded = true;
  }
}
