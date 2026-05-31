import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {LuminosityStat} from '../../../../domain/luminositystat';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title } from 'chart.js'
import 'chartjs-adapter-dayjs-3';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
    selector: 'app-luminosity-chart',
    templateUrl: './luminosity-chart.component.html',
    styleUrls: ['./luminosity-chart.component.css'],
    standalone: true,
    imports: [
        MatProgressSpinnerModule
    ]
})
export class LuminosityChartComponent implements OnInit, OnChanges {

  _seed = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() data!: LuminosityStat;

  isLoaded = false;

  showSpinner = true;

  chart: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.info('Initializing luminosity-chart...');
    if (changes.data && this.data) {
      this.isLoaded = true;
      this.changeDetectorRef.detectChanges();
      this.initChart(this.data);
    }
  }

  ngOnInit() {
  }


  initChart(data: LuminosityStat) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title);
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Luminosity',
          data: data.luminosity.map(el => ({
            x: new Date(el.dt),
            y: Number((el.value * 0.01).toFixed(2))
          })),
          borderColor: '#e8bc00',
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
              text: 'Luminosity'
            }
          }
        },
      }
    });

    }

}
