import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {LuminosityStat} from "../../../domain/luminositystat";
import * as Chart from 'chart.js';

@Component({
  selector: 'app-luminosity-chart',
  templateUrl: './luminosity-chart.component.html',
  styleUrls: ['./luminosity-chart.component.css']
})
export class LuminosityChartComponent implements OnInit, OnChanges {

  _seed: number = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: LuminosityStat;

  isLoaded: boolean = false;

  showSpinner: boolean = true;

  chart: Chart;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && this.data) {
      console.info('Initializing luminosity-chart...');
      this.initChart(this.data);
    }
  }

  ngOnInit() {
  }


  initChart(data: LuminosityStat) {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {

        datasets: [{
          label: 'Luminosity',
          data: data.luminosity.map(el => ({
            x: new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute),
            y: el.value.toFixed(2)
          })),
          backgroundColor: '#e8bc00',
          borderColor: '#e8bc00',
          pointRadius: 1,
        }]
      },

      options: {
        scales: {
          xAxes: [{
            type: "time",
            time: {
              unit: 'hour',
              unitStepSize: 2,
              displayFormats: {
                'hour': 'MMM DD hA',
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          },],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Luminosity'
            }
          }]
        },
      }
    });

    this.isLoaded = true;
  }

}
