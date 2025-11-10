// Vercel serverless function wrapper for Express app
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

// Import backend modules (using relative paths from api directory)
import authRoutes from '../backend/routes/authRoutes.js';
import taskRoutes from '../backend/routes/taskRoutes.js';
import { notFound, errorHandler } from '../backend/middleware/errorMiddleware.js';

// Initialize Express app
const app = express();

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) || ['*'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes('*') || !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB (optimized for serverless)
let cachedConnection = null;

const connectMongo = async () => {
  // Return cached connection if available and connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('MongoDB connection string is missing');
  }

  try {
    mongoose.set('strictQuery', true);

    // If already connecting or connected, return existing connection
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
      cachedConnection = mongoose.connection;
      return cachedConnection;
    }

    // Connect with serverless-optimized options
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedConnection = conn.connection;
    console.log(`MongoDB connected: ${cachedConnection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

// Initialize connection
connectMongo().catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Export as Vercel serverless function
export default app;

