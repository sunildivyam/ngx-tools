import { NextFunction, Request, Response } from 'express';
import { firestore } from 'firebase-admin';

import {
  fromDbFormat,
  initFireApp,
  toDbFormat
} from '../../common/services/common.service';
import { Cart } from '@annuadvent/ngx-core/helpers-ecommerce';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();
    const uid = req['currentuser'].uid;

    const db = firestore();
    const snap = await db.collection('cart').doc(uid).get();
    const cart = new Cart(fromDbFormat(snap));

    res.status(200).send(cart);
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
export const addCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();
    // get logged in user
    const uid = req['currentUser'].uid;

    const cartToAdd = new Cart(req.body);
    cartToAdd.id = uid;

    const db = firestore();
    const result = await db
      .collection('cart')
      .doc(cartToAdd.id)
      .set(toDbFormat(cartToAdd));

    res.status(200).send({
      ...cartToAdd,
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
export const updateCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();
    // get logged in user
    const uid = req['currentUser'].uid;
    const id = req.params.id;

    const cartToUpdate = new Cart(req.body);
    cartToUpdate.id = uid;

    const db = firestore();
    const snap = await db
      .collection('cart')
      .doc(id)
      .update(toDbFormat(cartToUpdate) as any);

    res.status(200).send({
      ...cartToUpdate,
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
export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();

  try {
    // get logged in user
    const uid = req['currentUser'].uid;
    const cartId = uid;
    const db = firestore();

    // Delete cart
    const snap = await db.collection('cart').doc(cartId).delete();

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send(error);
  }
};
