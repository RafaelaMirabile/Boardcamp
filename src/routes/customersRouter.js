import express from 'express'
import { createCustomer, fetchCustomer, listCustomers, updateCustomer } from '../controllers/customersController.js';
import { validateCustomer } from '../middlewares/customerValidation.js';

const router = express.Router();

router.get('/customers',listCustomers);
router.post('/customers',validateCustomer,createCustomer);

router.get('/customers/:id',fetchCustomer);
router.put('/customers/:id',validateCustomer,updateCustomer);

export default router;