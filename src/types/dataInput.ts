import { Types } from "mongoose";

export interface InputData {}

export interface UserDataInput {
  userId: Types.ObjectId;
  data: InputData
}
