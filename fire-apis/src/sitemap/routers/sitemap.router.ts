import * as express from 'express';
import { getSitemap } from '../controllers/sitemap.controller';

export const sitemapRouter = express.Router();

// IMAGES
// Get Image by fullPath (iid)
sitemapRouter.get('', getSitemap);
