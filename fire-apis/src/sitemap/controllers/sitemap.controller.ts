import { NextFunction, Request, Response } from 'express';
import { storage } from 'firebase-admin';
import { initFireApp } from '../../common/services/common.service';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getSitemap = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const app = initFireApp();

  try {
    const fStorage = storage();
    const bucket = fStorage.bucket(); // Get the default Firebase Storage bucket
    const file = bucket.file('sitemap.xml');

    const fileExists = await file.exists();

    if (!fileExists[0]) {
      res.status(404).send('sitemap.xml not found');
      return;
    }

    // Set appropriate headers for the image res
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('Content-Type', 'text/xml');

    // Create a readable stream from the file and pipe it to the res
    file.createReadStream().pipe(res);
  } catch (error) {
    res.status(500).send(error);
  }
};
