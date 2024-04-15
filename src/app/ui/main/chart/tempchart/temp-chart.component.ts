import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Chart, LineController, LineElement, PointElement, LinearScale, Title, TimeScale, Legend} from 'chart.js'
import {TempStat} from '../../../../domain/tempstat';

@Component({
  selector: 'app-temp-chart',
  templateUrl: './temp-chart.component.html',
  styleUrls: ['./temp-chart.component.css'],
  standalone: true
})
export class TempChartComponent implements OnInit, OnChanges {

  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: TempStat;

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

  ngOnInit() {
  }

  initChart(data: TempStat) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Legend);
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
            x: new Date(el.dt),
            y: (el.value * 0.01).toFixed(2)
          })),
        }, {
          label: 'Indoor SF',
          fill: false,
          backgroundColor: '#790b8e',
          borderColor: '#790b8e',
          pointRadius: 1,
          data: data.indoorSf.map(el => ({
            x: new Date(el.dt),
            y: (el.value * 0.01).toFixed(2)
          })),
        }, {
            label: 'Indoor GF',
            fill: false,
            backgroundColor: '#854492',
            borderColor: '#854492',
            pointRadius: 1,
            data: data.indoorGf.map(el => ({
              x: new Date(el.dt),
              y: (el.value * 0.01).toFixed(2)
            })),
          }, {
          label: 'Garage',
          fill: false,
          backgroundColor: '#666699',
          borderColor: '#666699',
          pointRadius: 1,
          data: data.garage.map(el => ({
            x: new Date(el.dt),
            y: (el.value * 0.01).toFixed(2)
          })),
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
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Temperature'
            }
          }
        },
      }
    });

    this.isLoaded = true;
  }
}
