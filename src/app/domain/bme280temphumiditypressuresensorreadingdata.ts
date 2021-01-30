import {SensorData} from "./sensordata";

export interface Bme280TempHumidityPressureSensorReadingData extends SensorData {
  temperature: number
  humidity: number
  pressure: number
}
