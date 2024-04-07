import { NextFunction, Request, Response } from 'express';
import { firestore } from 'firebase-admin';

import {
  fromDbFormat,
  initFireApp,
  toDbFormat
} from '../../common/services/common.service';
import { Category } from '@annuadvent/ngx-core/helpers-categories';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();

  try {
    const db = firestore();
    const snap = await db.collection('categories').get();
    const categories = snap.docs.map((doc) => new Category(fromDbFormat(doc)));

    res.status(200).send(categories);
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
export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();
  // get logged in user
  const uid = req['currentUser'].uid;

  const categoryToAdd = new Category(req.body);
  categoryToAdd.uid = uid;

  try {
    const db = firestore();
    const result = await db
      .collection('categories')
      .doc(categoryToAdd.id)
      .set(toDbFormat(categoryToAdd));

    res.status(200).send({
      ...categoryToAdd,
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
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();
  // get logged in user
  const uid = req['currentUser'].uid;
  const id = req.params.id;

  const categoryToUpdate = new Category(req.body);
  categoryToUpdate.uid = uid;

  try {
    const db = firestore();
    const snap = await db
      .collection('categories')
      .doc(id)
      .update(toDbFormat(categoryToUpdate) as any);

    res.status(200).send({
      ...categoryToUpdate,
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
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();
  // get logged in user
  const uid = req['currentUser'].uid;
  const categoryId = req.params.id;

  try {
    const db = firestore();

    // TODO: Check if it is not referenced from any other category or product
    const snapR = await db
      .collection('categories')
      .select('title', 'parents')
      .where('parents', 'array-contains', categoryId)
      .get();
    const rCategories = snapR.docs.map(
      (doc) => new Category(fromDbFormat(doc))
    );
    if (rCategories.length) {
      res.status(500).send({
        code: 'REFERENCE EXISTS',
        message: 'Unable to delete as Category references exist.',
        references: rCategories.map((cat) => cat.id)
      });
      return;
    }

    // Delete category
    const snap = await db.collection('categories').doc(categoryId).delete();

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send(error);
  }
};
