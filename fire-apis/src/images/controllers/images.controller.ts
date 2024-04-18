import { NextFunction, Request, Response } from 'express';
import { getFireStorageImage } from '../images-helpers';
import { getRemoteConfigParamValue } from '../../common/helpers/remote-config-helper';
import { GlobalConfigParamsEnum } from '@annuadvent/ngx-core/global-config';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const iid = req.query.iid as string; // Assuming the image ID is passed as a query parameter
  getFireStorageImage(iid, res, next);
};

/**
 * get
 * @param req
 * @param res
 * @param next
 */
export const getProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;
  const fileName = req.query.fileName;

  const fullPath = `${await getRemoteConfigParamValue(
    GlobalConfigParamsEnum.userImagePath
  )}/${uid}/${fileName}`;
  getFireStorageImage(fullPath, res, next);
};

/**
 * get
 * @param req
 * @param res
 * @param next
 */
export const getProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const fileName = req.params.fileName;

  const fullPath = `${await getRemoteConfigParamValue(
    GlobalConfigParamsEnum.productsImagePath
  )}/${id}/${fileName}`;
  getFireStorageImage(fullPath, res, next);
};

/**
 * get
 * @param req
 * @param res
 * @param next
 */
export const getCategoryImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const fileName = req.params.fileName;

  const fullPath = `${await getRemoteConfigParamValue(
    GlobalConfigParamsEnum.productsImagePath
  )}/${id}/${fileName}`;
  getFireStorageImage(fullPath, res, next);
};

/**
 * get
 * @param req
 * @param res
 * @param next
 */
export const getAppImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fileName = req.query.fileName;

  const fullPath = `${await getRemoteConfigParamValue(
    GlobalConfigParamsEnum.appImagePath
  )}/${fileName}`;
  getFireStorageImage(fullPath, res, next);
};
