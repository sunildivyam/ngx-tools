import * as express from 'express';
import { authenticatedGuard, adminGuard } from '../../auth/middleware';
import { getRemoteConfig } from '../controllers/remote-config.controller';

export const remoteConfigRouter = express.Router();

// REMOTE CONFIG

// Gets remote config.
remoteConfigRouter.get('', getRemoteConfig);
