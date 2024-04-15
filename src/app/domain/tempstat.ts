export interface TempStat {
  indoorSf: {
    dt: Date,
    value: number
  }[];
  indoorGf: {
    dt: Date,
    value: number
  }[];
  garage: {
    dt: Date,
    value: number
  }[];
  outdoor: {
    dt: Date,
    value: number
  }[];
}
