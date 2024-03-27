import { NextFunction, Request, Response } from 'express';
import { storage } from 'firebase-admin';
import { initFireApp } from '../../common/services/common.service';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const app = initFireApp();

  try {
    const iid = req.query.iid as string; // Assuming the image ID is passed as a query parameter

    if (!iid) {
      res.status(400).send('Image Id can not be empty.');
      return;
    }

    const fStorage = storage();
    const bucket = fStorage.bucket(); // Get the default Firebase Storage bucket
    const file = bucket.file(iid);

    const fileExists = await file.exists();

    if (!fileExists[0]) {
      res.status(404).send('Image not found');
      return;
    }

    // Set appropriate headers for the image res
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('Content-Type', 'image/jpeg');

    // Create a readable stream from the file and pipe it to the res
    file.createReadStream().pipe(res);
  } catch (error) {
    res.status(500).send(error);
  }
};
