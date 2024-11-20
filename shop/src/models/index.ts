import express from 'express';
import bodyParser from 'body-parser';
import { connectToDatabase } from '../routes/db';
import productsRouter from './productsRouter';
import usersRouter from './usersRouter';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to database and set routers
connectToDatabase().then((db) => {
  app.locals.db = db;
  app.use('/products', productsRouter);
  app.use('/users', usersRouter);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database', err);
});