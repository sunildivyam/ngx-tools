import { NextFunction, Request, Response } from 'express';
import { firestore } from 'firebase-admin';

import { initFireApp } from '../../common/services/common.service';
import { Address } from '../classes/address.class';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();
  // get logged in user
  const uid = req['currentUser'].uid;

  if (!uid) {
    res.status(403).send({
      code: 'Unathourized',
      message:
        'You are not authorized to perform this operation. Please sign in with valid user credentials.',
    });
  }

  try {
    const db = firestore();
    const snap = await db.collection('addresses').where('uid', '==', uid).get();
    const addresses = snap.docs.map(
      (doc) =>
        new Address({
          ...doc.data(),
          id: doc.id,
          updateTime: doc.updateTime,
          createTime: doc.createTime,
        })
    );

    res.status(200).send(addresses);
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
export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();
  // get logged in user
  const uid = req['currentUser'].uid;

  const addressToAdd = new Address(req.body);

  if (!uid || uid !== addressToAdd.uid) {
    res.status(403).send({
      code: 'Unathourized',
      message:
        'You are not authorized to perform this operation. Please sign in with valid user credentials.',
    });
  }

  try {
    const db = firestore();
    const snap = await db
      .collection('addresses')
      .add(addressToAdd.toDbFormat());

    res.status(200).send(snap);
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
export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();
  // get logged in user
  const uid = req['currentUser'].uid;
  const addressId = req.params.id;

  const addressToUpdate = new Address(req.body);

  if (!uid || uid !== addressToUpdate.uid) {
    res.status(403).send({
      code: 'Unathourized',
      message:
        'You are not authorized to perform this operation. Please sign in with valid user credentials.',
    });
  }

  try {
    const db = firestore();
    const snap = await db
      .collection('addresses')
      .doc(addressId)
      .update(addressToUpdate.toDbFormat() as any);

    res.status(200).send({ ...addressToUpdate, updateTime: snap.writeTime });
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
export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();
  // get logged in user
  const uid = req['currentUser'].uid;
  const addressId = req.params.id;

  if (!uid) {
    res.status(403).send({
      code: 'Unathourized',
      message:
        'You are not authorized to perform this operation. Please sign in with valid user credentials.',
    });

    return;
  }

  try {
    const db = firestore();

    const addressToDeleteSnap = await db
      .collection('addresses')
      .doc(addressId)
      .get();

    if (uid !== addressToDeleteSnap.data()?.uid) {
      res.status(403).send({
        code: 'Unathourized',
        message:
          'You are not authorized to perform this operation. Please sign in with valid user credentials.',
      });
      return;
    }

    const snap = await db.collection('addresses').doc(addressId).delete();

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send(error);
  }
};
