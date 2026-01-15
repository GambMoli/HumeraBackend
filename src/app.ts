import express, { Application } from 'express';
import router from './routes/index.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

const app: Application = express();

app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

export default app;