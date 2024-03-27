import { NextFunction, Request, Response } from 'express';
import { remoteConfig } from 'firebase-admin';

import { initFireApp } from '../../common/services/common.service';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getRemoteConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();

  try {
    const fConfig = remoteConfig();
    const rConfig = await fConfig.getTemplate();

    res.status(200).send(rConfig);
  } catch (error) {
    res.status(500).send(error);
  }
};
