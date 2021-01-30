import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as Chart from 'chart.js';
import {BoilerTempStat} from "../../../domain/boilertempstat";

@Component({
  selector: 'app-boiler-temp-stat-chart',
  templateUrl: './boiler-temp-chart.component.html',
  styleUrls: ['./boiler-temp-chart.component.css']
})
export class BoilerTempChartComponent implements OnInit, OnChanges {

  _seed: number = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: BoilerTempStat;

  isLoaded: boolean = false;

  showSpinner: boolean = true;
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && this.data) {
      console.info('Initializing boiler temp chart...');
      this.initChart(this.data);
    }
  }

  ngOnInit() {
  }

  chart: Chart;

  initChart(data: BoilerTempStat) {
    var timeArray = data.temperature.map(el => new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'Temperature',
          data: data.temperature.map(el => ({
            x: new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute),
            y: (el.value * 0.01).toFixed(2)
          })),
          backgroundColor: '#bb3b01',
          borderColor: '#bb3b01',
          pointRadius: 1,
        }]
      },

      options: {
        scales: {
          xAxes: [{
            type: "time",
            time: {
              unit: 'hour',
              unitStepSize: 2,
              displayFormats: {
                'hour': 'MMM DD hA',
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
      }
    });

    this.isLoaded = true;
  }
}
