import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from '../controllers/address.controller';
import {
  addBulkPincodes,
  addPincode,
  deletePincode,
  getPincode,
  updatePincode,
} from '../controllers/pincode.controller';

export const addressRouter = express.Router();

// ADDRESSES
/**
 * Set default address to User's profile.
 * And not here.
 */

// Gets User Addresses
addressRouter.get('', authenticatedGuard, getAddresses);

// Add User Address
addressRouter.post('/add', authenticatedGuard, addAddress);

// update User Address
addressRouter.post('/update/:id', authenticatedGuard, updateAddress);

// delete User Address
addressRouter.post('/delete/:id', authenticatedGuard, deleteAddress);

// Get Pincode details
addressRouter.get('/pincode/:id', authenticatedGuard, getPincode);

// Add Pincode
addressRouter.post('/pincode/add', authenticatedGuard, addPincode);

// Update Pincode
addressRouter.post('/pincode/update/:id', authenticatedGuard, updatePincode);

// Delete Pincode
addressRouter.post('/pincode/delete/:id', authenticatedGuard, deletePincode);

// Bulk Add Pincode
addressRouter.post('/pincode/add/bulk', authenticatedGuard, addBulkPincodes);
