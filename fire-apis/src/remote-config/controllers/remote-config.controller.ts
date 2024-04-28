import { NextFunction, Request, Response } from 'express';
import { remoteConfig } from 'firebase-admin';

import { initFireApp } from '../../common/services/common.service';
import { RemoteConfigTemplate } from 'firebase-admin/lib/remote-config/remote-config-api';

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
    const rConfig: RemoteConfigTemplate = await fConfig.getTemplate();
    res.status(200).send(rConfig);
  } catch (error) {
    res.status(500).send(error);
  }
};
