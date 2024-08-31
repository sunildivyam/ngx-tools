const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

// To authorize GoogleApis, install gcloud for windows and run from project directory: >> gcloud auth application-default login
const { google } = require('googleapis');

admin.initializeApp();

const storage = admin.storage().bucket();
const hosting = google.firebasehosting('v1beta1');

exports.updateHostingWithImageHash = functions.https.onRequest(
  async (req, res) => {
    try {
      const imageFilePath = req.query.filePath; // Path to the image in Firebase Storage
      const hostingSite = 'your-hosting-site-id'; // Replace with your Firebase Hosting site ID

      // 1. Read an image file from Firebase Storage
      const file = storage.file(imageFilePath);
      const [fileData] = await file.download();

      // 2. Create a hash for this file
      const hash = crypto.createHash('sha256').update(fileData).digest('hex');

      // 3. Get the latest version of release from Firebase Hosting
      const versions = await hosting.sites.versions.list({
        parent: `sites/${hostingSite}`
      });
      const latestVersion = versions.data.versions[0].name;

      // 4. List file hashes for all files in this version
      const files = await hosting.sites.versions.files.list({
        parent: latestVersion,
        pageSize: 1000 // Adjust as needed
      });

      // 5. Add our image file's hash to the new release version's hash files
      const newFile = {
        path: imageFilePath,
        hash
      };
      const updatedFiles = [...files.data.files, newFile];

      // 6. Deploy the new release version
      const newVersion = await hosting.sites.versions.create({
        parent: `sites/${hostingSite}`,
        versionId: 'new-version',
        requestBody: {
          files: updatedFiles
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
  }
);
