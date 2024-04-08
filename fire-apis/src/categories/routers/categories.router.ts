import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import {
  addCategory,
  deleteCategory,
  getCategories,
  listLiveCategories,
  updateCategory
} from '../controllers/categories.controller';

export const categoriesRouter = express.Router();

// CATEGORIES

// Gets Categories
categoriesRouter.get('', authenticatedGuard, getCategories);

// Add Category
categoriesRouter.post('/add', authenticatedGuard, addCategory);

// update Category
categoriesRouter.post('/update/:id', authenticatedGuard, updateCategory);

// delete Category
categoriesRouter.post('/delete/:id', authenticatedGuard, deleteCategory);

// Query kind of routes
// List Categories (Live Only)
categoriesRouter.get('/list', listLiveCategories);
