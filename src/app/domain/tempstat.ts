export interface TempStat {
  indoor: {
    dt: { year: number, monthValue: number, dayOfMonth: number, hour: number, minute: number },
    value: number
  }[];
  indoorGf: {
    dt: { year: number, monthValue: number, dayOfMonth: number, hour: number, minute: number },
    value: number
  }[];
  garage: {
    dt: { year: number, monthValue: number, dayOfMonth: number, hour: number, minute: number },
    value: number
  }[];
  outdoor: {
    dt: { year: number, monthValue: number, dayOfMonth: number, hour: number, minute: number },
    value: number
  }[];
}
