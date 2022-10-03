import express from 'express'
import { listRentals } from '../controllers/rentalsControllers.js';

const router = express.Router();

router.get('/rentals',listRentals);

export default router;