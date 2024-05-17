import { mongodbURL } from "./config/config.js";
import mongoose from "mongoose";
mongoose
  .connect(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database is running");
  })
  .catch((error) => {
    console.log(error);
  });
  const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

export default db;
