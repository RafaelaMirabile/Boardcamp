import express from 'express'
import { createCategory, listCategories } from '../controllers/categoriesController.js';
import validateCategory from '../middlewares/categorieValidation.js';

const router = express.Router();

router.get('/categories', listCategories);
router.post('/categories',validateCategory,createCategory);

export default router;