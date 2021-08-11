import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {OutdoorTempStat} from '../../../../domain/outdoor-temp-stat';
import * as Chart from 'chart.js';
import {PressureStat} from '../../../../domain/pressurestat';

@Component({
  selector: 'app-general-temp-chart',
  templateUrl: './general-temp-chart.component.html',
  styleUrls: ['./general-temp-chart.component.css']
})
export class GeneralTempChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: OutdoorTempStat;

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

  initChart(data: OutdoorTempStat) {
    const timeArray = data.temperature.map(el => new Date(el.dt));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'Temperature',
          data: data.temperature.map(el => ({
            x: new Date(el.dt),
            y: (el.value * 0.01).toFixed(2)
          })),
          backgroundColor: 'transparent',
          borderColor: '#476bb9',// "#2E4895"
          pointRadius: 1
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
              labelString: 'Temperature'
            }
          }]
        },
      },

    });
    this.isLoaded = true;
  }

}
