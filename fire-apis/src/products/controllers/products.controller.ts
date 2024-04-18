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
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();
    const uid = req['currentUser'].uid;

    const db = firestore();
    const snap = await db.collection('products').where('uid', '==', uid).get();
    const products = snap.docs.map((doc) => new Product(fromDbFormat(doc)));

    res.status(200).send(products);
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
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();

    // get logged in user
    const uid = req['currentUser'].uid;

    const productToAdd = new Product(req.body);
    productToAdd.uid = uid;

    const db = firestore();
    try {
      const snapE = await db.collection('products').doc(productToAdd.id).get();
      const product = new Product(fromDbFormat(snapE));
      if (product?.id) {
        res.status(500).send({
          code: 'DUPLICATE_PRODUCT',
          message: `Duplicate product with id ${productToAdd.id} already exist.`
        });
        return;
      }
    } catch (error) {}

    const result = await db
      .collection('products')
      .doc(productToAdd.id)
      .set(toDbFormat(productToAdd));

    res.status(200).send({
      ...productToAdd,
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
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();
    // get logged in user
    const uid = req['currentUser'].uid;
    const id = req.params.id;

    const productToUpdate = new Product(req.body);
    productToUpdate.uid = uid;

    const db = firestore();
    const snap = await db
      .collection('products')
      .doc(id)
      .update(toDbFormat(productToUpdate) as any);

    res.status(200).send({
      ...productToUpdate,
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
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    initFireApp();

    const productId = req.params.id;

    const db = firestore();

    // TODO: Check if, there are any unprocessed orders of the this product

    // Delete product
    const snap = await db.collection('products').doc(productId).delete();

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send(error);
  }
};
