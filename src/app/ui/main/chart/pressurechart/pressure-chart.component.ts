import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {PressureStat} from '../../../../domain/pressurestat';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pressure-chart',
  templateUrl: './pressurechart.component.html',
  styleUrls: ['./pressurechart.component.css'],
  imports: [
    MatProgressSpinnerModule
  ],
  standalone: true
})
export class PressureChartComponent implements OnInit, OnChanges {

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

  ngOnInit() {
  }


  initChart(data: PressureStat) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
    const timeArray = data.pressure.map(el => new Date(el.dt));
    const measValueArray = data.pressure.map(el => el.value)
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'Pressure',
          data: measValueArray,
          borderColor: 'rgba(255,153,0,0.4)',
          backgroundColor: 'transparent'
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
              text: 'Pressure'
            }
          }
        },
      }
    });

    this.isLoaded = true;
  }
}
