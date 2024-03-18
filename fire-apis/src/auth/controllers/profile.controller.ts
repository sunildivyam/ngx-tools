import { NextFunction, Request, Response } from 'express';
import { auth, firestore } from 'firebase-admin';

import { initFireApp } from '../../common/services/common.service';
import { AuthErrorCodes } from 'firebase/auth';

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();

  const uid = req.params.uid;
  const db = firestore();

  try {
    const result = await db.collection('user-profiles').doc(uid).get();
    res.status(200).send({ id: result.id, ...result.data() });
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const addProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();

  const uid = req.params.uid;
  const profileData = req.body;
  const fAuth = auth();
  const db = firestore();

  try {
    // check if user exists
    const user = await fAuth.getUser(uid);

    // delete id from profile data if it has.
    delete profileData.id;

    // Add profile for the uid
    const result = await db
      .collection('user-profiles')
      .doc(uid)
      .set(profileData);

    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();

  const uid = req.params.uid;
  const profileData = req.body;
  const fAuth = auth();
  const db = firestore();

  try {
    // check if user exists
    await fAuth.getUser(uid);

    // delete id from profile data if it has.
    delete profileData.id;

    // update profile for the uid
    const result = await db
      .collection('user-profiles')
      .doc(uid)
      .update(profileData);

    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();

  const uid = req.params.uid;
  const fAuth = auth();
  const db = firestore();

  try {
    // check if user exists
    await fAuth.getUser(uid);

    // update profile for the uid
    const result = await db.collection('user-profiles').doc(uid).delete();

    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};
