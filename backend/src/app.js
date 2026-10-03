import express from 'express';
import 'dotenv/config';
import { router } from './api/routes.js';
const app = express();

app.use('/api/v1', router);

export {app};