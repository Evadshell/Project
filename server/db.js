import { mongodbURL } from "./config/config.js";
import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Project1', 
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

connectDB();

export default db;
