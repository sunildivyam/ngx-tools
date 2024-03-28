import { NextFunction, Request, Response } from 'express';
import { firestore } from 'firebase-admin';

import {
  fromDbFormat,
  initFireApp,
  toDbFormat,
} from '../../common/services/common.service';
import { isPincodeValid } from '../services/validate.service';
import { Pincode } from '../classes/pincode.class';
import { collection } from 'firebase/firestore';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getPincode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (!isPincodeValid(id)) {
    res.status(403).send({
      code: 'Bad request',
      message: 'Invalid Pincode',
    });
    return;
  }

  initFireApp();

  try {
    const db = firestore();
    const snap = await db.collection('pincodes').doc(id).get();
    const pincode = new Pincode(fromDbFormat(snap));

    res.status(200).send(pincode);
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
export const addPincode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = new Pincode(req.body);

  if (!isPincodeValid(pincode.id) || !pincode.city || !pincode.state) {
    res.status(403).send({
      code: 'Bad request',
      message: 'Invalid Pincode details',
    });
    return;
  }

  initFireApp();

  try {
    const db = firestore();
    const snap = await db
      .collection('pincodes')
      .doc(pincode.id)
      .set(toDbFormat(pincode));

    res.status(200).send({
      ...pincode,
      createTime: snap.writeTime.toDate(),
      updateTime: snap.writeTime.toDate(),
    });
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
export const updatePincode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = new Pincode(req.body);
  const id = req.params.id;

  if (!isPincodeValid(id) || !pincode.city || !pincode.state) {
    res.status(403).send({
      code: 'Bad request',
      message: 'Invalid Pincode details',
    });
    return;
  }

  initFireApp();

  try {
    const db = firestore();
    const snap = await db
      .collection('pincodes')
      .doc(id)
      .set(toDbFormat(pincode));

    res.status(200).send({
      ...pincode,
      id,
      updateTime: snap.writeTime.toDate(),
    });
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
export const deletePincode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (!isPincodeValid(id)) {
    res.status(403).send({
      code: 'Bad request',
      message: 'Invalid Pincode.',
    });
    return;
  }

  initFireApp();

  try {
    const db = firestore();
    await db.collection('pincodes').doc(id).delete();

    res.status(200).send({
      success: true,
    });
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
export const addBulkPincodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(req.body instanceof Array) && !req.body.length) {
    res.status(403).send({
      code: 'Bad request',
      message: 'Provide an array of Pincode object.',
    });
    return;
  }

  if (req.body.length > 500) {
    res.status(403).send({
      code: 'MAXIMUM_LIMIT_EXCEDDED',
      message: 'Bulk write allows a maximum of 500 pincodes per second only.',
    });
    return;
  }

  const failed = [];
  initFireApp();
  const db = firestore();
  const bulkWriter = db.bulkWriter();
  const collectionRef = db.collection('pincodes');
  let successCount = 0;

  req.body.forEach((p) => {
    const pincode = new Pincode(p);
    if (!isPincodeValid(pincode.id) || !pincode.city || !pincode.state) {
      failed.push({
        id: pincode.id,
        error: { code: 'Bad request', message: 'Invalid Pincode.' },
      });
    } else {
      bulkWriter
        .set(collectionRef.doc(pincode.id), toDbFormat(pincode))
        .then(() => {
          successCount++;
        })
        .catch((error) => {
          failed.push({ id: pincode.id, error });
        });
    }
  });

  try {
    await bulkWriter.flush();

    res.status(200).send({
      successCount,
      failed,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
