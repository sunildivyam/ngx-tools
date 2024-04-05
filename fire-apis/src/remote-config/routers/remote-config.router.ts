import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import {
  getProfileParams,
  getRemoteConfig
} from '../controllers/remote-config.controller';

export const remoteConfigRouter = express.Router();

// REMOTE CONFIG

// Gets remote config.
remoteConfigRouter.get('', getRemoteConfig);

// Gets Profile config.
remoteConfigRouter.get('/profile/params', getProfileParams);
