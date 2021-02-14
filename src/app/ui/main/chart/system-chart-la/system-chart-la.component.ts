import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as Chart from 'chart.js';
import {LaStat} from "../../../../domain/lastat";

@Component({
  selector: 'app-system-chart-la',
  templateUrl: './system-chart-la.component.html',
  styleUrls: ['./system-chart-la.component.css']
})
export class SystemChartLaComponent implements OnInit, OnChanges {

  _seed: number = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: LaStat;

  isLoaded: boolean = false;

  showSpinner: boolean = true;

  chart: Chart;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && this.data) {
      console.info('Initializing la-chart...');
      this.initChart(this.data);
    }
  }

  ngOnInit() {
  }


  initChart(data: LaStat) {
    var timeArray = data.la.map(el => new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'LA',
          data: data.la.map(el => ({
            x: new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute),
            y: (el.value * 0.01).toFixed(2)
          })),
          backgroundColor: '#bb3b01',
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
              labelString: 'LA'
            }
          }]
        },
      }
    });

    this.isLoaded = true;
  }
}
