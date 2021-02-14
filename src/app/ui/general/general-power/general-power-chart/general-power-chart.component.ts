import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as Chart from "chart.js";
import {PowerStat} from "../../../../domain/power-stat";

@Component({
  selector: 'app-general-power-chart',
  templateUrl: './general-power-chart.component.html',
  styleUrls: ['./general-power-chart.component.css']
})
export class GeneralPowerChartComponent implements OnInit, OnChanges {
  _seed: number = 31;
  timeFormat = 'MM/DD/YYYY HH:mm';

  @ViewChild('canvas') canvas: ElementRef;
  @Input() data: PowerStat;

  isLoaded: boolean = false;

  showSpinner: boolean = true;

  chart: Chart;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && this.data) {
      console.info('Initializing temp-chart...');
      this.initChart(this.data);
    }
  }

  ngOnInit(): void {
  }

  initChart(data: PowerStat) {
    var timeArray = data.power.map(el => new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute));
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'Power',
          data: data.power.map(el => ({
            x: new Date(el.dt.year, el.dt.monthValue - 1, el.dt.dayOfMonth, el.dt.hour, el.dt.minute),
            y: (el.value * 0.01).toFixed(2)
          })),
          backgroundColor: "transparent",
          borderColor: "#2E4895"
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
              labelString: 'Power'
            }
          }]
        },
      },

    });
    this.isLoaded = true;
  }


}
