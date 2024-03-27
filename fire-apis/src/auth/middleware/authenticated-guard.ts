// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.currentUser`.

import { auth } from 'firebase-admin';
import { initFireApp } from '../../common/services/common.service';
import * as cookie from 'cookie';

export const authenticatedGuard = async (req, res, next) => {
  const reqCookie = cookie.parse(req.headers.cookie || '');

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')) &&
    !(reqCookie && reqCookie.Authorization)
  ) {
    res.status(403).send({
      code: 'unauthorized',
      message: `No Firebase ID token was passed as a Bearer token in the Authorization header.
      Make sure you authorize your request by providing the following HTTP header:
      Authorization: Bearer <Firebase ID Token>
      or by passing a "Authorization" cookie.`,
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
  } else if (reqCookie) {
    // Read the ID Token from cookie.
    idToken = reqCookie.Authorization.split('Bearer ')[1];
  } else {
    // No cookie
    res.status(403).send({
      code: 'unauthorized',
      message: `No Firebase ID token was passed as a Bearer token in the Authorization header.
      Make sure you authorize your request by providing the following HTTP header:
      Authorization: Bearer <Firebase ID Token>
      or by passing a "Authorization" cookie.`,
    });

    return;
  }

  const app = initFireApp();

  try {
    const decodedIdToken = await auth().verifyIdToken(idToken);

    req.currentUser = decodedIdToken;
    next();
  } catch (error) {
    res.status(403).send({
      code: 'unauthorized',
      message: 'Error while verifying ID token',
      error,
    });

    return;
  }
};
