import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import {
  getImage,
  getProfileImage,
  getProductImage,
  getCategoryImage,
  getAppImage
} from '../controllers/images.controller';

export const imagesRouter = express.Router();

// IMAGES
// Get Image by fullPath (iid) in query param
imagesRouter.get('', getImage);

// Get Image by user profile (uid) | QueryParam = fileName
imagesRouter.get('/profile/:uid', getProfileImage);

// Get Product Image Eg. /product/1100011/1.jpg | QueryParam = fileName
imagesRouter.get('/product/:id', getProductImage);

// Get Category Image Eg. /category/women | QueryParam = fileName
imagesRouter.get('/category/:id', getCategoryImage);

// Get App Image Eg. /app/banner-1.jpg | logo.jpg | page1.jpeg | QueryParam = fileName
imagesRouter.get('/app', getAppImage);
