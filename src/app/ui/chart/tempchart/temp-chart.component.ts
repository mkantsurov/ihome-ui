import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as Chart from 'chart.js';
import {TempStat} from '../../../domain/tempstat';

@Component({
  selector: 'app-temp-chart',
  templateUrl: './temp-chart.component.html',
  styleUrls: ['./temp-chart.component.css']
})
export class TempChartComponent implements OnInit, OnChanges {

  _seed: number = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: TempStat;

  isLoaded: boolean = false;

  showSpinner: boolean = true;

  chart: Chart;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && this.data) {
      console.info('Initializing temp-chart...');
      this.initChart(this.data);
    }
  }

  ngOnInit() {
  }


  initChart(data: TempStat) {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Outdoor',
          fill: false,
          backgroundColor: '#e8bc00',
          borderColor: '#e8bc00',
          pointRadius: 1,
          data: data.outdoor.map(el => ({
            x: new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute),
            y: (el.value * 0.01).toFixed(2)
          })),
        }, {
          label: 'Indoor SF',
          fill: false,
          backgroundColor: '#790b8e',
          borderColor: '#790b8e',
          pointRadius: 1,
          data: data.indoor.map(el => ({
            x: new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute),
            y: (el.value * 0.01).toFixed(2)
          })),
        }, {
            label: 'Indoor GF',
            fill: false,
            backgroundColor: '#854492',
            borderColor: '#854492',
            pointRadius: 1,
            data: data.indoorGf.map(el => ({
              x: new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute),
              y: (el.value * 0.01).toFixed(2)
            })),
          }, {
          label: 'Garage',
          fill: false,
          backgroundColor: '#666699',
          borderColor: '#666699',
          pointRadius: 1,
          data: data.garage.map(el => ({
            x: new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute),
            y: (el.value * 0.01).toFixed(2)
          })),
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: 'Chart.js Time Scale'
        },
        tooltips: {
          mode: 'point',
          intersect: true,
          footerFontStyle: 'normal'
        },
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
              labelString: 'Date'
            }
          }],
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
