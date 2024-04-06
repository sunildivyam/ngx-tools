import { NextFunction, Request, Response } from 'express';
import { auth, firestore, remoteConfig } from 'firebase-admin';

import {
  fromDbFormat,
  initFireApp,
  toDbFormat
} from '../../common/services/common.service';
import { AuthErrorCodes } from 'firebase/auth';
import { Profile } from '@annuadvent/ngx-core/helpers-auth';
import { RemoteConfigTemplate } from 'firebase-admin/lib/remote-config/remote-config-api';

const filterProfileForParams = async (profile: Profile): Promise<any> => {
  if (!profile) return null;

  const fConfig = remoteConfig();
  const rConfig: RemoteConfigTemplate = await fConfig.getTemplate();

  let pParams = rConfig.parameters['userProfileParams']?.defaultValue || null;
  if (pParams) {
    pParams = JSON.parse((pParams as any).value);
  } else {
    return null;
  }

  const pParamsArr = Object.keys(pParams);
  const filteredProfile = {};
  // Match profile params with remote profile params
  Object.keys(profile).forEach((key) => {
    if (pParamsArr.includes(key)) {
      filteredProfile[key] = profile[key];
    }
  });

  return filteredProfile;
};

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
    const profile = fromDbFormat(result);
    const filteredProfile = await filterProfileForParams(profile);
    res.status(200).send(filteredProfile);
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
  // filter in only profile params, from remoteconfig
  const profileData = await filterProfileForParams(req.body);
  const fAuth = auth();
  const db = firestore();

  try {
    // check if user exists
    const user = await fAuth.getUser(uid);

    // TODO: Can Save to User Table (auth), all the params that belong to auth. Rest will go to user-profiles
    // Check for changed params with user data, and save changed params only

    // Add profile for the uid
    const result = await db
      .collection('user-profiles')
      .doc(uid)
      .set(toDbFormat(profileData));

    res
      .status(200)
      .send({ ...profileData, updateTime: result.writeTime.toDate() });
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
  const profileData = await filterProfileForParams(req.body);
  const fAuth = auth();
  const db = firestore();

  try {
    // check if user exists
    const user = await fAuth.getUser(uid);

    // TODO: Can Save to User Table (auth), all the params that belong to auth. Rest will go to user-profiles
    // Check for changed params with user data, and save changed params only

    // update profile for the uid
    const result = await db
      .collection('user-profiles')
      .doc(uid)
      .update(toDbFormat(profileData));

    res
      .status(200)
      .send({ ...profileData, updateTime: result.writeTime.toDate() });
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

    // Delete profile for the uid
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
