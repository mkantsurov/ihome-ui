import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SystemStat} from '../../../../domain/systemstat';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-system-chart',
  templateUrl: './system-chart.component.html',
  styleUrls: ['./system-chart.component.css']
})
export class SystemChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: SystemStat;

  isLoaded = false;

  showSpinner = true;

  chart: Chart;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && this.data) {
      console.info('Initializing system-chart...');
      this.initChart(this.data);
    }
  }

  ngOnInit() {
  }


  initChart(data: SystemStat) {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Heap Max',
          fill: false,
          backgroundColor: '#790b8e',
          borderColor: '#790b8e',
          pointRadius: 1,
          data: data.heapMax.map(el => ({
            x: new Date(el.dt),
            y: el.value.toFixed(2)
          })),
        }, {
          label: 'Heap Usage',
          fill: false,
          backgroundColor: '#854492',
          borderColor: '#854492',
          pointRadius: 1,
          data: data.heapUsage.map(el => ({
            x: new Date(el.dt),
            y: el.value.toFixed(2)
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
              labelString: 'MB'
            }
          }]
        },
      }
    });

    this.isLoaded = true;
  }

}
