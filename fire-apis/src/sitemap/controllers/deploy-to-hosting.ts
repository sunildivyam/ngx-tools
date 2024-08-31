import * as crypto from 'node:crypto';
import * as zlib from 'node:zlib';
import { Readable } from 'node:stream';
import * as debugPkg from 'debug';
import { GoogleAuth } from 'google-auth-library';
import { NextFunction, Request, Response } from 'express';
import { initFireApp } from '../../common/services/common.service';
import { storage } from 'firebase-admin';

const debug = debugPkg('update-single-file');

const HOSTING_URL = 'https://firebasehosting.googleapis.com/v1beta1';
const PROJECT_ID = 'ecommerce-333';
const SITE_ID = PROJECT_ID;
const filesData: Record<string, Buffer> = {};

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
    const filesByHash = await readFilesFromBucket();
    await updateLatestRelease(filesByHash);

    res.status(200).send('New version deployed successfully');
  } catch (error) {
    console.error('Error deploying new version:', error);
    res.status(500).send('Error deploying new version');
  }
};

const getContent = async (fileData: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const strm = new Readable();
    strm._read = () => {}; // _read is required but you can noop it

    strm.push(fileData);
    strm.push(null);

    const chunks: Buffer[] = [];

    strm
      .pipe(zlib.createGzip({ level: 9 }))
      .on('data', (chunk) => {
        chunks.push(chunk);
      })
      .on('end', () => {
        console.log('READ END');
        resolve(Buffer.concat(chunks)); // Concatenate all the chunks and resolve
      })
      .on('error', (err) => {
        console.log('READ Err', err);
        reject(err);
      });
  });
};

const readFilesFromBucket = async (): Promise<Record<string, string>> => {
  const fStorage = storage();
  const bucket = fStorage.bucket(); // Get the default Firebase Storage bucket
  const imageFilePath = 'temp/12.jpg'; //req.query.filePath; // Path to the image in Firebase Storage

  // 1. Read an image file from Firebase Storage
  const file = bucket.file(imageFilePath);
  const [fileData] = await file.download();

  console.log('Starting read');
  // 2. Create a hash for this file
  const content = await getContent(fileData);
  console.log('Finished read');
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  const filesByHash: Record<string, string> = { [hash]: '/assets/12.jpg' };
  filesData[hash] = content;

  return filesByHash;
};

async function updateLatestRelease(
  filesByHash: Record<string, string>
): Promise<void> {
  // Authorize requets
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
    projectId: PROJECT_ID
  });

  // Create a Authorized client to make requests
  const client = await auth.getClient();

  const res = await client.request<{
    release: { name: string; version: { name: string } };
  }>({
    url: `${HOSTING_URL}/projects/${PROJECT_ID}/sites/${SITE_ID}/channels/live`
  });

  console.log('%d %j', res.status, res.data);

  const release = res.data.release.name;
  const currentVersion = res.data.release.version.name;

  console.log(`Release name: ${release}`);
  console.log(`Current version name: ${currentVersion}`);

  const exclude: string[] = [];
  for (let f of Object.values(filesByHash)) {
    f = f.startsWith('/') ? f : `/${f}`;
    exclude.push(`^${f.replace('/', '\\/')}$`);
  }
  console.log('Excludes:', exclude);
  const cloneRes = await client.request<{ name: string }>({
    method: 'POST',
    url: `${HOSTING_URL}/projects/${PROJECT_ID}/sites/${SITE_ID}/versions:clone`,
    body: JSON.stringify({
      sourceVersion: currentVersion,
      finalize: false,
      exclude: { regexes: exclude }
    })
  });

  console.log('%d %j', cloneRes.status, cloneRes.data);
  const operationName = cloneRes.data.name;
  console.log(`Operation name: ${operationName}`);

  let done = false;
  let newVersion = '';
  while (!done) {
    const opRes = await client.request<{
      done: boolean;
      response: { name: string };
    }>({
      url: `${HOSTING_URL}/${operationName}`
    });
    console.log('%d %j', opRes.status, opRes.data);
    done = !!opRes.data.done;
    newVersion = opRes.data.response?.name;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  console.log(`New version: ${newVersion}`);

  const data: Record<string, string> = {};
  for (let [h, f] of Object.entries(filesByHash)) {
    if (!f.startsWith('/')) {
      f = `/${f}`;
    }
    data[f] = h;
  }
  console.log('Posting populate files: %o', { files: data });
  const populateRes = await client.request<{
    uploadUrl: string;
    uploadRequiredHashes?: string[];
  }>({
    method: 'POST',
    url: `${HOSTING_URL}/projects/${PROJECT_ID}/${newVersion}:populateFiles`,
    body: JSON.stringify({ files: data })
  });
  console.log('%d %j', populateRes.status, populateRes.data);

  const uploadURL = populateRes.data.uploadUrl;
  const uploadRequiredHashes = populateRes.data.uploadRequiredHashes || [];
  if (Array.isArray(uploadRequiredHashes) && uploadRequiredHashes.length) {
    for (const h of uploadRequiredHashes) {
      const uploadRes = await client.request({
        method: 'POST',
        url: `${uploadURL}/${h}`,
        data: filesData[h]
      });
      console.log('%d %j', uploadRes.status, uploadRes.data);
      if (uploadRes.status !== 200) {
        throw new Error(`Failed to upload file ${filesByHash[h]} (${h})`);
      }
    }
  }

  const finalizeRes = await client.request<unknown>({
    method: 'PATCH',
    url: `${HOSTING_URL}/projects/${PROJECT_ID}/${newVersion}`,
    params: { updateMask: 'status' },
    body: JSON.stringify({
      status: 'FINALIZED'
    })
  });
  console.log('%d %j', finalizeRes.status, finalizeRes.data);

  const releaseRes = await client.request<unknown>({
    method: 'POST',
    url: `${HOSTING_URL}/projects/${PROJECT_ID}/sites/${SITE_ID}/releases`,
    params: { versionName: newVersion },
    body: JSON.stringify({
      message: 'Deployed from single file uploader.'
    })
  });
  console.log('%d %j', releaseRes.status, releaseRes.data);

  const siteRes = await client.request<{ defaultUrl: string }>({
    url: `${HOSTING_URL}/projects/${PROJECT_ID}/sites/${SITE_ID}`
  });
  console.log('%d %j', siteRes.status, siteRes.data);

  console.log(`Successfully deployed! Site URL: ${siteRes.data.defaultUrl}`);
}
