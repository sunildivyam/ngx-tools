import { NextFunction, Request, Response } from 'express';
import { storage } from 'firebase-admin';
import { initFireApp } from '../../common/services/common.service';
import * as crypto from 'crypto';

import { google, firebasehosting_v1beta1 } from 'googleapis';
import { GlobalOptions } from 'googleapis/build/src/apis/firebasehosting';

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

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const setSitemap = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const app = initFireApp();
  try {
    const fStorage = storage();
    const bucket = fStorage.bucket(); // Get the default Firebase Storage bucket

    const imageFilePath = 'temp/12.jpg'; //req.query.filePath; // Path to the image in Firebase Storage
    const hostingSite = 'ecommerce-333'; // Replace with your Firebase Hosting site ID

    // 1. Read an image file from Firebase Storage
    const file = bucket.file(imageFilePath);
    const [fileData] = await file.download();

    // 2. Create a hash for this file
    const hash = crypto.createHash('sha256').update(fileData).digest('hex');

    const auth = new google.auth.GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/firebase',
      projectId: 'ecommerce-333'
    });

    // const client = await auth.getClient();

    const opt: GlobalOptions = {
      auth: auth
    };

    const hosting = new firebasehosting_v1beta1.Firebasehosting(opt);

    // 3. Get the latest version of release from Firebase Hosting
    const request = {
      parent: `sites/${hostingSite}`
      // headers: {
      //   Authorization: `Bearer ${token.access_token}`
      // }
    };
    const versions = await hosting.sites.versions.list(request);

    const latestVersion = versions.data.versions[0].name;

    // 4. List file hashes for all files in this version
    const files = await hosting.sites.versions.files.list({
      parent: latestVersion,
      pageSize: 1000 // Adjust as needed
    });

    // 5. Add our image file's hash to the new release version's hash files
    const newFile = {
      path: '/assets/12.jpg',
      hash
    };

    const updatedFiles = [...files.data.files, newFile];

    function getFiles() {
      let pFiles = {};
      updatedFiles.forEach((f) => (pFiles[f.path] = f.hash));
      return pFiles;
    }
    // console.log(files.data.files);

    const popus = await hosting.sites.versions.populateFiles({
      parent: `${latestVersion}`,
      requestBody: {
        files: getFiles()
      }
    });

    console.log('POPUS: ', popus);

    // 6. Deploy the new release version
    const newVersion = await hosting.sites.versions.create({
      parent: `sites/${hostingSite}`,
      requestBody: {
      
      }
    });

    await hosting.sites.versions.patch({
      name: newVersion.data.name,
      updateMask: 'status',
      requestBody: {
        status: 'FINALIZED'
      }
    });

    res.status(200).send('New version deployed successfully');
  } catch (error) {
    console.error('Error deploying new version:', error);
    res.status(500).send('Error deploying new version');
  }
};
