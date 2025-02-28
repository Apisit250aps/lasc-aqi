import { ObjectId } from "mongodb";
import db from "../db";
import { IDevice } from "./devices";

export interface IAir extends Document {
  device?: ObjectId | string;
  deviceData?: IDevice;
  temperature: number;
  humidity: number;
  pm1: number;
  pm25: number;
  pm10: number;
  createdAt: Date;
  updatedAt: Date;
}

const airs = db.collection<IAir>("airs");
export default airs;
