import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from '../controllers/address.controller';

export const addressRouter = express.Router();

// ADDRESSES
/**
 * Set default address to User's profile.
 * And not here.
 */

// Gets User Addresses
addressRouter.get('', authenticatedGuard, getAddresses);

// Add User Address
addressRouter.post('add', authenticatedGuard, addAddress);

// update User Address
addressRouter.post('update/:id', authenticatedGuard, updateAddress);

// delete User Address
addressRouter.post('delete/:id', authenticatedGuard, deleteAddress);
