import {Bme280TempHumidityPressureSensorReadingData} from "./bme280temphumiditypressuresensorreadingdata";
import {Dht21TempHumiditySensorReadingData} from "./dht21temphumiditysensorreadingdata";
import {Ds18b20TempSensorReadingData} from "./ds18b20tempsensorreadingdata";
import {BinarySensorData} from "./binarysensordata";
import {Tsl2591LuminositySensorReadingData} from "./tsl2591LuminositySensorReadingdata";

export interface ModuleData {

  moduleId: number
  name: string
  mode: number
  active: boolean
  outputPortState: number

  binarySensorData: BinarySensorData[]
  temperatureSensorData: Ds18b20TempSensorReadingData[]
  tempHumiditySensorData: Dht21TempHumiditySensorReadingData[]
  bme280TempHumidityPressureSensorData: Bme280TempHumidityPressureSensorReadingData[]
  tsl2591LuminositySensorData: Tsl2591LuminositySensorReadingData[]
}
