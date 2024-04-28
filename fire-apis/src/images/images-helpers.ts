import { NextFunction, Request, Response } from 'express';
import { initFireApp } from '../common/services/common.service';
import * as admin from 'firebase-admin';

export const getFireStorageImage = async (
  fullPath: string, // Folder path including filename
  res: Response,
  next: NextFunction
) => {
  try {
    const app = initFireApp();
    const fStorage = admin.storage();
    const bucket = fStorage.bucket(); // Get the default Firebase Storage bucket
    const file = bucket.file(fullPath);
    const metaData = await file.getMetadata();
    // Set appropriate headers for the image res
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('Content-Type', metaData && metaData[0].contentType);

    // Create a readable stream from the file and pipe it to the res
    file.createReadStream().pipe(res);
  } catch (error) {
    res.status(500).send(error);
  }
};
