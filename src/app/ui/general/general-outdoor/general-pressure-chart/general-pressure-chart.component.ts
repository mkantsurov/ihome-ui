import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {PressureStat} from '../../../../domain/pressurestat';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'

@Component({
  selector: 'app-general-pressure-chart',
  templateUrl: './general-pressure-chart.component.html',
  styleUrls: ['./general-pressure-chart.component.css'],
  standalone: true
})
export class GeneralPressureChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: PressureStat;

  isLoaded = false;

  showSpinner = true;

  chart: any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && this.data) {
      console.info('Initializing pressure-chart...');
      this.initChart(this.data);
    }
  }

  ngOnInit(): void {
  }

  initChart(data: PressureStat) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
    const timeArray = data.pressure.map(el => new Date(el.dt));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'Pressure',
          data: data.pressure.map(el => ({
            x: new Date(el.dt),
            y: el.value
          })),
          backgroundColor: 'transparent',
          borderColor: '#476bb9',// "#2E4895"
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
            display: true,
            title: {
              display: true,
              text: 'Pressure'
            }
          }
        },
      },

    });
    this.isLoaded = true;
  }

}
