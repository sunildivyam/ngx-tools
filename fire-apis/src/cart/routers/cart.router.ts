import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import {
  addCart,
  deleteCart,
  getCart,
  updateCart
} from '../controllers/cart.controller';

export const cartRouter = express.Router();

// CART

// Gets Cart
cartRouter.get('', authenticatedGuard, getCart);

// Add Cart
cartRouter.post('/add', authenticatedGuard, addCart);

// update Cart
cartRouter.post('/update', authenticatedGuard, updateCart);

// delete Cart
cartRouter.post('/delete', authenticatedGuard, deleteCart);
