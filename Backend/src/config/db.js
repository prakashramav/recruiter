import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to primary DB: ${error.message}`);
    // Fallback to local MongoDB if primary connection fails during development
    if (process.env.NODE_ENV === 'development') {
      try {
        console.log('Attempting to fallback to local MongoDB...');
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/talentify');
        console.log(`Local MongoDB Connected: ${localConn.connection.host}`);
        return;
      } catch (localError) {
        console.error(`Local MongoDB Error: ${localError.message}`);
      }
    }
    process.exit(1);
  }
};
