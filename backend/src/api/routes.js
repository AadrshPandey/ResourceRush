import {Router} from 'express';
import { lockResource } from '../controller/lockResource.js';

const router = Router();

router.post('/book', lockResource);

export { router };