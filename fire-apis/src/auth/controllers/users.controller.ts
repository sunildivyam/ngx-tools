import { NextFunction, Request, Response } from 'express';
import { auth } from 'firebase-admin';
import { initFireApp } from '../../common/services/common.service';
import { UserIdentifier } from 'firebase-admin/auth';

/**
 * GET
 */
export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let nextPageToken = req.params?.nextPageToken as string;
  nextPageToken = nextPageToken === 'null' ? '' : nextPageToken;

  const pageSize = parseInt(req.params?.pageSize as string);

  if (isNaN(pageSize)) {
    console.log('Invalid pageSize');
    res.status(400).send(`Invalid pageSize: ${req.params?.pageSize}`);
    return;
  }

  initFireApp();
  const fAuth = auth();

  try {
    let users;

    if (nextPageToken) {
      users = await fAuth.listUsers(pageSize, nextPageToken);
    } else {
      users = await fAuth.listUsers(pageSize);
    }

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ messgae: 'Something went wrong', error });
  }

  return;
};

/**
 * POST
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let userIdentifiers: Array<UserIdentifier> = req.body;

  initFireApp();
  const fAuth = auth();

  try {
    const users = await fAuth.getUsers(userIdentifiers);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ messgae: 'Something went wrong', error });
  }
};
