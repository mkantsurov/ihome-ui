import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SystemStat} from '../../../../domain/systemstat';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-system-chart',
  templateUrl: './system-chart.component.html',
  styleUrls: ['./system-chart.component.css'],
  imports: [
    MatProgressSpinnerModule
  ],
  standalone: true
})
export class SystemChartComponent implements OnInit, OnChanges {
  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: SystemStat;

  isLoaded = false;

  showSpinner = true;

  chart: any;

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
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
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
        plugins: {
          tooltip: {
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
              text: 'MB'
            }
          }
        },
      }
    });

    this.isLoaded = true;
  }

}
