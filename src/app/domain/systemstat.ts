export interface SystemStat {
  heapMax: {
    dt: { year: number, monthValue: number, dayOfMonth: number, hour: number, minute: number },
    value: number
  }[],
  heapUsage: {
    dt: { year: number, monthValue: number, dayOfMonth: number, hour: number, minute: number },
    value: number
  }[]
}
