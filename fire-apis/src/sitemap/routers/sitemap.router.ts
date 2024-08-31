import * as express from 'express';
import { getSitemap } from '../controllers/sitemap.controller';
import { setSitemap } from '../controllers/deploy-to-hosting';

export const sitemapRouter = express.Router();

// IMAGES
// Get Image by fullPath (iid)
sitemapRouter.get('', getSitemap);

sitemapRouter.post('/single', setSitemap);
