import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const url = process.env.MONGO_URI.replace(
      /<db_password>/,
      process.env.MONGO_PASSWORD
    );

    const connect = await mongoose.connect(url);

    console.log(`connected to database`);
  } catch (error) {
    console.log(error);
  }
};

export default connectToDB;
