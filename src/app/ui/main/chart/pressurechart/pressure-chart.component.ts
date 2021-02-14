import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {PressureStat} from "../../../../domain/pressurestat";
import * as Chart from 'chart.js';

@Component({
  selector: 'app-pressure-chart',
  templateUrl: './pressurechart.component.html',
  styleUrls: ['./pressurechart.component.css']
})
export class PressureChartComponent implements OnInit, OnChanges {

  _seed: number = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: PressureStat;

  isLoaded: boolean = false;

  showSpinner: boolean = true;

  chart: Chart;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && this.data) {
      console.info('Initializing pressure-chart...');
      this.initChart(this.data);
    }
  }

  ngOnInit() {
  }


  initChart(data: PressureStat) {
    var timeArray = data.pressure.map(el => new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute));
    var measValueArray = data.pressure.map(el => el.value)
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'Pressure',
          data: measValueArray,
          borderColor: "rgba(255,153,0,0.4)",
          backgroundColor: 'transparent'
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
              labelString: 'Pressure'
            }
          }]
        },
      }
    });

    this.isLoaded = true;
  }
}
