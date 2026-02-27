import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';
import summaryRoutes from './routes/summary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

const connectToMongo = async () => {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
  console.log('MongoDB connected');
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.log('MongoDB connection error:', error.message);
});

app.use((req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected. Please retry in a few seconds.'
    });
  }

  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/summary', summaryRoutes);

app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    message: 'Server is running',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

const startServer = async () => {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not set');
    }

    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
