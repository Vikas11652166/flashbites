const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error(`
      ╔═══════════════════════════════════════════╗
      ║   ❌ MONGO_URI NOT CONFIGURED            ║
      ║                                           ║
      ║   Please add MONGO_URI environment       ║
      ║   variable in your Railway dashboard     ║
      ╚═══════════════════════════════════════════╝
      `);
      throw new Error('MONGO_URI environment variable is not defined');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Options for better connection handling
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`
    ╔═══════════════════════════════════════════╗
    ║   MongoDB Connected Successfully         ║
    ║   Host: ${conn.connection.host}          ║
    ║   Database: ${conn.connection.name}      ║
    ╚═══════════════════════════════════════════╝
    `);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;