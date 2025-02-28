import { Document } from 'mongodb';
import db from '../db';

export interface IDevice extends Document {
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  updatedAt?:Date;
  createdAt?: Date;
}

const devices = db.collection<IDevice>('devices');
export default devices;