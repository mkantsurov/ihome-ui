export interface PowerConsumption {
  extConsumption: {
    dt: Date,
    value: number
  }[];
  intConsumption: {
    dt: Date,
    value: number
  }[];
  intBckConsumption: {
    dt: Date,
    value: number
  }[]
}
