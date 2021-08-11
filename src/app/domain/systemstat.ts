export interface SystemStat {
  heapMax: {
    dt: Date,
    value: number
  }[],
  heapUsage: {
    dt: Date,
    value: number
  }[]
}
