import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mpesaRoutes from './routes/mpesa.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', mpesaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ M-Pesa backend running on port ${ localhost:8080}`));
