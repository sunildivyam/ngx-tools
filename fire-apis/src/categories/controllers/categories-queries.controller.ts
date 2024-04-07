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
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  initFireApp();

  try {
    const db = firestore();
    const snap = await db.collection('categories').doc(id).get();
    const category = new Category(fromDbFormat(snap));

    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};
