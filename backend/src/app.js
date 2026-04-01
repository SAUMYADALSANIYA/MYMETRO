import express from 'express';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/customer', customerRoutes);
app.use('/payment', paymentRoutes);
app.use('/search', searchRoutes);

export default app;