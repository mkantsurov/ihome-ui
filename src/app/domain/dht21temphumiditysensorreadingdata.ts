import {SensorData} from "./sensordata";

export interface Dht21TempHumiditySensorReadingData extends SensorData {
  temperature: number;
  humidity: number;
}
