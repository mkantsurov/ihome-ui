import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as Chart from 'chart.js';
import {PowerStat} from '../../../../domain/power-stat';

@Component({
  selector: 'app-power-chart',
  templateUrl: './power-chart.component.html',
  styleUrls: ['./power-chart.component.css']
})
export class PowerChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: PowerStat;

  isLoaded = false;

  showSpinner = true;

  chart: Chart;

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

  initChart(data: PowerStat) {
    const timeArray = data.power.map(el => new Date(el.dt));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'Power',
          data: data.power.map(el => ({
            x: new Date(el.dt),
            y: (el.value * 0.1).toFixed(1)
          })),
          backgroundColor: 'transparent',
          borderColor: '#2E4895'
        }]
      },

      options: {
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'hour',
              unitStepSize: 2,
              displayFormats: {
                hour: 'MMM DD hA',
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          },],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power'
            },
            ticks: {
              suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
              // OR //
              beginAtZero: true   // minimum value will be 0.
            }
          }],
        },
      },

    });
    this.isLoaded = true;
  }

}
