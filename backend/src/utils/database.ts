import mongoose from 'mongoose';

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

/**
 * Database configuration
 */
const getDatabaseConfig = (): DatabaseConfig => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/evolution-gadget';
  
  const options: mongoose.ConnectOptions = {
    // Connection options
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    
    // Additional options for production
    ...(process.env.NODE_ENV === 'production' && {
      retryWrites: true,
      w: 'majority'
    })
  };

  return { uri, options };
};

/**
 * Connect to MongoDB
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const { uri, options } = getDatabaseConfig();

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    // Connect to database
    await mongoose.connect(uri, options);

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};

/**
 * Get database connection status
 */
export const getDatabaseStatus = (): string => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
};

/**
 * Health check for database
 */
export const checkDatabaseHealth = async (): Promise<{ status: string; message: string }> => {
  try {
    const state = mongoose.connection.readyState;
    
    if (state === 1) { // Connected
      // Try a simple operation to verify the connection is working
      await mongoose.connection.db.admin().ping();
      return {
        status: 'healthy',
        message: 'Database connection is healthy'
      };
    } else {
      return {
        status: 'unhealthy',
        message: `Database is ${getDatabaseStatus()}`
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
