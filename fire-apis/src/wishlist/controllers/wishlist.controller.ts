import { NextFunction, Request, Response } from 'express';
import { firestore } from 'firebase-admin';

import {
  fromDbFormat,
  initFireApp,
  toDbFormat
} from '../../common/services/common.service';
import { Wishlist } from '@annuadvent/ngx-core/helpers-ecommerce';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();
    const uid = req['currentUser'].uid;

    const db = firestore();
    const snap = await db.collection('wishlist').doc(uid).get();
    const wishlist = new Wishlist(fromDbFormat(snap));

    res.status(200).send(wishlist);
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
export const addWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();
    // get logged in user
    const uid = req['currentUser'].uid;

    const wishlistToAdd = new Wishlist(req.body);
    wishlistToAdd.id = uid;

    const db = firestore();
    const result = await db
      .collection('wishlist')
      .doc(wishlistToAdd.id)
      .set(toDbFormat(wishlistToAdd));

    res.status(200).send({
      ...wishlistToAdd,
      createTime: result.writeTime.toDate(),
      updateTime: result.writeTime.toDate()
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
export const updateWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();
    // get logged in user
    const uid = req['currentUser'].uid;

    const wishlistToUpdate = new Wishlist(req.body);
    wishlistToUpdate.id = uid;

    const db = firestore();
    const snap = await db
      .collection('wishlist')
      .doc(uid)
      .update(toDbFormat(wishlistToUpdate) as any);

    res.status(200).send({
      ...wishlistToUpdate,
      updateTime: snap.writeTime.toDate()
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
export const deleteWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();

  try {
    // get logged in user
    const uid = req['currentUser'].uid;
    const wishlistId = uid;
    const db = firestore();

    // Delete wishlist
    const snap = await db.collection('wishlist').doc(wishlistId).delete();

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send(error);
  }
};
