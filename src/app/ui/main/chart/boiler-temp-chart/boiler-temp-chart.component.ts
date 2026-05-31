import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {BoilerTempStat} from '../../../../domain/boilertempstat';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-boiler-temp-stat-chart',
  templateUrl: './boiler-temp-chart.component.html',
  styleUrls: ['./boiler-temp-chart.component.css'],
  imports: [
    MatProgressSpinner
  ],
  standalone: true
})
export class BoilerTempChartComponent implements OnInit, OnChanges {
  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() data!: BoilerTempStat;

  isLoaded = false;

  showSpinner = true;

  chart: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && this.data) {
      console.info('Initializing boiler temp chart...');
      this.isLoaded = true;
      this.changeDetectorRef.detectChanges();
      this.initChart(this.data);
    }
  }

  ngOnInit() {
  }

  initChart(data: BoilerTempStat) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
    const timeArray = data.temperature.map(el => new Date(el.dt));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'Boiler Temperature',
          data: data.temperature.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.01).toFixed(2))
          })),
          borderColor: '#bb3b01',
          backgroundColor: 'transparent',
          pointRadius: 1,
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
              text: 'Temperature'
            }
          }
        },
      }
    });

    }
}
