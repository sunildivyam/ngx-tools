import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../controllers/products.controller';
import { listLiveProducts } from '../controllers/products-queries.controller';

export const productsRouter = express.Router();

// CATEGORIES

// Gets Products
productsRouter.get('', authenticatedGuard, getProducts);

// Add Product
productsRouter.post('/add', authenticatedGuard, addProduct);

// update Product
productsRouter.post('/update/:id', authenticatedGuard, updateProduct);

// delete Product
productsRouter.post('/delete/:id', authenticatedGuard, deleteProduct);

// Query kind of routes
// List Products (Live Only)
productsRouter.get('/list', listLiveProducts);
