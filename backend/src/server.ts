import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import favoritesRoutes from './routes/favoritesRoutes';
import userRoutes from './routes/userRoutes';
import geminiRoutes from './routes/geminiRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', geminiRoutes);

app.get('/', (req, res) => {
    res.send('Student Haven Hub Backend is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
