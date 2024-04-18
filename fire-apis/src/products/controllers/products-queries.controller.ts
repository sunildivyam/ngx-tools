import { NextFunction, Request, Response } from 'express';
import { firestore } from 'firebase-admin';

import {
  fromDbFormat,
  initFireApp,
  toDbFormat
} from '../../common/services/common.service';
import { Product } from '@annuadvent/ngx-core/helpers-ecommerce';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  initFireApp();

  try {
    const db = firestore();
    const snap = await db.collection('products').doc(id).get();
    const product = new Product(fromDbFormat(snap));

    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const listLiveProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();

  try {
    const db = firestore();
    const snap = await db
      .collection('products')
      .where('isLive', '==', true)
      .get();
    const products = snap.docs.map((doc) => new Product(fromDbFormat(doc)));

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
};
