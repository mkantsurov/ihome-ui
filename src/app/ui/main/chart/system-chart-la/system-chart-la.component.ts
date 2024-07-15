import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Chart, LineController, LineElement, PointElement, LinearScale, Title, TimeScale} from 'chart.js'
import {LaStat} from '../../../../domain/lastat';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-system-chart-la',
  templateUrl: './system-chart-la.component.html',
  styleUrls: ['./system-chart-la.component.css'],
  imports: [
    MatProgressSpinnerModule
  ],
  standalone: true
})
export class SystemChartLaComponent implements OnInit, OnChanges {

  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: LaStat;

  isLoaded = false;

  showSpinner = true;

  chart: any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && this.data) {
      console.info('Initializing la-chart...');
      this.initChart(this.data);
    }
  }

  ngOnInit() {
  }


  initChart(data: LaStat) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
    const timeArray = data.la.map(el => new Date(el.dt));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'LA',
          data: data.la.map(el => ({
            x: new Date(el.dt),
            y: (el.value * 0.01).toFixed(2)
          })),
          backgroundColor: '#bb3b01',
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
            title: {
              display: true,
              text: 'LA'
            }
          }
        },
      }
    });

    this.isLoaded = true;
  }
}
