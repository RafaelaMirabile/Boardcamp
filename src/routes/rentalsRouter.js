import express from 'express'
import { createRental, deleteRental, listRentals, returnRental } from '../controllers/rentalsControllers.js';
import { validateRentals } from '../middlewares/rentalsValidation.js';

const router = express.Router();

router.get('/rentals',listRentals);
router.post('/rentals', validateRentals, createRental);

router.post('/rentals/:id/return',returnRental);
router.delete('/rentals/:id',deleteRental);

export default router;