export interface PowerStat {
  temperature: {
    dt: { year: number, monthValue: number, dayOfMonth: number, hour: number, minute: number },
    value: number
  }[]
}
