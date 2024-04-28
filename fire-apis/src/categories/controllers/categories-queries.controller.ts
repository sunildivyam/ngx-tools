import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';

import {
  fromDbFormat,
  initFireApp,
  toDbFormat
} from '../../common/services/common.service';
import { Category } from '@annuadvent/ngx-core/helpers-categories';
import { AppError } from '@annuadvent/ngx-core/app-error';

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

  try {
    initFireApp();
    const db = admin.firestore();
    const snap = await db.collection('categories').doc(id).get();
    const category = new Category(fromDbFormat(snap));
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(new AppError(error));
  }
};
