import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

import mongoose from 'mongoose';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import toolsRoutes from './routes/tools.routes';
import categoriesRoutes from './routes/categories.routes';
import promptsRoutes from './routes/prompts.routes';
import savedRoutes from './routes/saved.routes';
import recentlyViewedRoutes from './routes/recentlyViewed.routes';
import ratingsRoutes from './routes/ratings.routes';
import assistantRoutes from './routes/assistant.routes';
import formsRoutes from './routes/forms.routes';
import adsRoutes from './routes/ads.routes';
import bugReportsRoutes from './routes/bugReports.routes';
import adRequestsRoutes from './routes/adRequests.routes';
import contactMessagesRoutes from './routes/contactMessages.routes';
import newsletterRoutes from './routes/newsletter.routes';
import useCasesRoutes from './routes/useCases.routes';
import settingsRoutes from './routes/settings.routes';
import { notFound, errorHandler } from './middleware/error.middleware';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Increased limit
});
app.use('/api/', limiter);

// Parsing Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/prompts', promptsRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/admin/ads', adsRoutes);
app.use('/api/admin/bug-reports', bugReportsRoutes);
app.use('/api/admin/ad-requests', adRequestsRoutes);
app.use('/api/admin/contact-messages', contactMessagesRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/use-cases', useCasesRoutes);
app.use('/api/settings', settingsRoutes);

// Health Route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', api: 'running', database: dbStatus });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
