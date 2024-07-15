import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {OutdoorTempStat} from '../../../../domain/outdoor-temp-stat';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {PressureStat} from '../../../../domain/pressurestat';

@Component({
  selector: 'app-general-temp-chart',
  templateUrl: './general-temp-chart.component.html',
  styleUrls: ['./general-temp-chart.component.css'],
  standalone: true
})
export class GeneralTempChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: OutdoorTempStat;

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

  initChart(data: OutdoorTempStat) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
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
              text: 'Temperature'
            }
          }
        },
      },

    });
    this.isLoaded = true;
  }

}
