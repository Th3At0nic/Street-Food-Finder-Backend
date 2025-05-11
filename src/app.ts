import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

const corsOptions = {
  origin: ['https://street-bite-frontend.vercel.app', 'http://localhost:3000'],
  methods: '*',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// parsers
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/', router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
