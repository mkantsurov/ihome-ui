export interface SystemSummary {
  upTime: number;
  loadAvg: number;
  heapMax: number;
  heapUsage: number;
  sfTemperature: number;
  sfHumidity: number;
  pressure: number;
  gfTemperature: number;
  outDoorTemperature: number;
  outDoorHumidity: number;
  garageTemperature: number;
  garageHumidity: number;
  boilerTemperature: number;
  luminosity: number;
  powerStatus: number;
  securityMode: number;
  pwSrcConverterMode: number;
  pwSrcDirectMode: number;
  heatingPumpFFMode: number;
  heatingPumpSFMode: number;
}
