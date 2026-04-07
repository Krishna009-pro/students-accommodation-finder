import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import favoritesRoutes from './routes/favoritesRoutes';
import userRoutes from './routes/userRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('Student Haven Hub Backend is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


