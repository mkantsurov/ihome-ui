import {SensorData} from "./sensordata";

export interface Ds18b20TempSensorReadingData extends SensorData {
  data: number
}
