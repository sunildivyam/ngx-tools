import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import { getImage } from '../controllers/images.controller';

export const imagesRouter = express.Router();

// IMAGES
// Get Image by fullPath (iid)
imagesRouter.get('', getImage);
