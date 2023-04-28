export interface PowerVoltage {
  extVoltage: {
    dt: Date,
    value: number
  }[];
  intVoltage: {
    dt: Date,
    value: number
  }[]
}
