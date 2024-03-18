// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.currentUser`.

import { auth } from 'firebase-admin';
import { initFireApp } from '../../common/services/common.service';

export const authenticated = async (req, res, next) => {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)
  ) {
    res.status(403).send({
      code: 'unauthorized',
      message: `No Firebase ID token was passed as a Bearer token in the Authorization header.
      Make sure you authorize your request by providing the following HTTP header:
      Authorization: Bearer <Firebase ID Token>
      or by passing a "__session" cookie.`,
    });

    return;
  }

  let idToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send({
      code: 'unauthorized',
      message: `No Firebase ID token was passed as a Bearer token in the Authorization header.
      Make sure you authorize your request by providing the following HTTP header:
      Authorization: Bearer <Firebase ID Token>
      or by passing a "__session" cookie.`,
    });

    return;
  }

  initFireApp();

  try {
    const decodedIdToken = await auth().verifyIdToken(idToken);
    req.currentUser = decodedIdToken;
    next();
  } catch (error) {
    res.status(403).send({
      code: 'unauthorized',
      message: 'Error while verifying ID token',
    });

    return;
  }
};
