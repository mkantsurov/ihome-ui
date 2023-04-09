import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
import {PowerStat} from '../../../../domain/power-stat';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-general-power-chart',
  templateUrl: './general-power-chart.component.html',
  styleUrls: ['./general-power-chart.component.css']
})
export class GeneralPowerChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: PowerStat;

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

  initChart(data: PowerStat) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
    const timeArray = data.power.map(el => new Date(el.dt));
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
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
          borderColor: '#476bb9',// "#2E4895"
          pointRadius: 1
        }]
      },

      options: {
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
              text: 'Power'
            },
            suggestedMin: 0,
            beginAtZero: true
          }
        },
      },

    });
    this.isLoaded = true;
  }


}
