import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import {
  addWishlist,
  deleteWishlist,
  getWishlist,
  updateWishlist
} from '../controllers/wishlist.controller';

export const wishlistRouter = express.Router();

// CART

// Gets Wishlist
wishlistRouter.get('', authenticatedGuard, getWishlist);

// Add Wishlist
wishlistRouter.post('/add', authenticatedGuard, addWishlist);

// update Wishlist
wishlistRouter.post('/update', authenticatedGuard, updateWishlist);

// delete Wishlist
wishlistRouter.post('/delete', authenticatedGuard, deleteWishlist);
