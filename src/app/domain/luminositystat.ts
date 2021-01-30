export interface LuminosityStat {
  luminosity: {
    dt: { year: number, monthValue: number, dayOfMonth: number, hour: number, minute: number },
    value: number
  }[]
}
