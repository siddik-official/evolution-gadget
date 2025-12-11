import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDatabase, checkDatabaseHealth } from '@/utils/database';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { 
  corsOptions, 
  generalLimiter, 
  securityHeaders, 
  logger, 
  compressionMiddleware,
  timeoutMiddleware,
  validateContentType
} from '@/middleware/security';

// Import routes
import authRoutes from '@/routes/auth';
import gadgetRoutes from '@/routes/gadgets';

// Load environment variables
dotenv.config();

/**
 * Create Express application
 */
const createApp = (): Application => {
  const app = express();

  // Trust proxy for correct IP addresses
  app.set('trust proxy', 1);

  // Security middleware
  app.use(securityHeaders);
  app.use(cors(corsOptions));
  app.use(generalLimiter);
  app.use(timeoutMiddleware());

  // Compression and logging
  app.use(compressionMiddleware);
  app.use(logger);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Content type validation for API routes
  app.use('/api', validateContentType());

  // Health check endpoint
  app.get('/health', async (req: Request, res: Response) => {
    const dbHealth = await checkDatabaseHealth();
    
    res.status(dbHealth.status === 'healthy' ? 200 : 503).json({
      status: dbHealth.status === 'healthy' ? 'OK' : 'Service Unavailable',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth,
      version: process.env.npm_package_version || '1.0.0'
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/gadgets', gadgetRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    console.log('🔄 Starting server...');
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to database
    await connectDatabase();
    
    // Verify MongoDB connection
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: '❌ Disconnected',
      1: '✅ Connected',
      2: '🔄 Connecting',
      3: '⚠️ Disconnecting'
    };
    
    console.log(`📊 MongoDB Status: ${dbStates[dbState as keyof typeof dbStates] || 'Unknown'}`);
    
    if (dbState !== 1) {
      throw new Error('MongoDB connection failed - server cannot start');
    }
    
    console.log(`📊 MongoDB Database: ${mongoose.connection.db.databaseName}`);
    console.log(`📊 MongoDB Host: ${mongoose.connection.host}`);

    // Create Express app
    const app = createApp();

    // Get port from environment
    const PORT = parseInt(process.env.PORT || '5000', 10);
    const HOST = process.env.HOST || 'localhost';

    // Start server
    const server = app.listen(PORT, HOST, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
      console.log(`📊 Health check available at http://${HOST}:${PORT}/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('✅ All systems operational');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      
      server.close(async () => {
        console.log('✅ HTTP server closed');
        
        try {
          // Close database connection
          await mongoose.connection.close();
          console.log('✅ Database connection closed');
          
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        console.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is executed directly
if (require.main === module) {
  startServer();
}

export { createApp, startServer };
