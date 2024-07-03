import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectToDatabase = async () => {
  try {
    console.log("-----", process.env.MONGODB_URI);
    const databaseConnection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(
      `\n MongoDB connected !! DB HOST: ${databaseConnection.connection.host}`
    );
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

export default connectToDatabase;