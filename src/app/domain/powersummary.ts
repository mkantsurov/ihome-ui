export interface PowerSummary {
  luminosity: number;
  extVoltage: number;
  extCurrent: number;
  extFrequency: number;
  extConsumption:number;
  intVoltage: number;
  intCurrent: number;
  intFrequency: number;
  intConsumption:number;
  intBckVoltage: number;
  intBckCurrent: number;
  intBckFrequency: number;
  intBckConsumption:number;
  securityMode: number;
  pwSrcConverterMode: number;
  pwSrcDirectMode: number;
}
