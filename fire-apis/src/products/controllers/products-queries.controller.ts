import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';

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
export const listLiveProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  initFireApp();

  try {
    const db = admin.firestore();
    const snap = await db.collection('products').doc(id).get();
    const product = new Product(fromDbFormat(snap));
    if (!product.isLive) {
      res.status(404).send(`Product not found of id: ${id}`);
      return;
    }

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
    const categoryIds: string = req.query.categoryIds as string;
    const ids: string = req.query.ids as string;

    const db = admin.firestore();
    let dbQuery = null;

    if (categoryIds) {
      dbQuery = db
        .collection('products')
        .where('isLive', '==', true)
        .where('categories', 'array-contains-any', categoryIds.split(','))
        .get();
    } else if (ids) {
      dbQuery = db
        .collection('products')
        .where(admin.firestore.FieldPath.documentId(), 'in', ids.split(','))
        .where('isLive', '==', true)
        .get();
    } else {
      dbQuery = db.collection('products').where('isLive', '==', true).get();
    }

    const snap = await dbQuery;
    const products = snap.docs.map((doc) => new Product(fromDbFormat(doc)));

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
};
