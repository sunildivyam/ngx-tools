import { NextFunction, Request, Response } from 'express';
import { auth } from 'firebase-admin';
import { initFireApp, mergeUnique } from '../../common/services/common.service';
import { CreateRequest, UpdateRequest } from 'firebase-admin/auth';
import { AuthErrorCodes } from 'firebase/auth';

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;

  initFireApp();
  const fAuth = auth();

  try {
    const result = await fAuth.getUser(uid);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.params.email;

  initFireApp();
  const fAuth = auth();

  try {
    const result = await fAuth.getUserByEmail(email);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getUserByPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const phone = req.params.phone;

  initFireApp();
  const fAuth = auth();

  try {
    const result = await fAuth.getUserByPhoneNumber(phone);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const disableUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;

  initFireApp();
  const fAuth = auth();

  const updateRequest: UpdateRequest = {
    disabled: true,
  };

  try {
    const result = await fAuth.updateUser(uid, updateRequest);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const enableUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;

  initFireApp();
  const fAuth = auth();

  const updateRequest: UpdateRequest = {
    disabled: false,
  };

  try {
    const result = await fAuth.updateUser(uid, updateRequest);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initFireApp();
  const fAuth = auth();

  const createRequest: CreateRequest = req.body;

  try {
    const result = await fAuth.createUser(createRequest);
    res.status(200).send(result);
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
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;

  initFireApp();
  const fAuth = auth();

  const updateRequest: UpdateRequest = req.body;

  try {
    const result = await fAuth.updateUser(uid, updateRequest);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;

  initFireApp();
  const fAuth = auth();

  try {
    await fAuth.deleteUser(uid);
    res.status(200).send(true);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * GET
 * @param req
 * @param res
 * @param next
 */
export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;

  initFireApp();
  const fAuth = auth();

  try {
    const result = await fAuth.getUser(uid);
    const roles = result.customClaims?.roles || [];
    res.status(200).send(roles);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const addRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;
  const roles = req.body as Array<string>;

  if (!(roles instanceof Array)) {
    res.status(400).send({
      code: 'Bad Request',
      message: 'Roles must be an array of string',
    });
    return;
  }

  initFireApp();
  const fAuth = auth();

  try {
    const user = await fAuth.getUser(uid);
    const customClaims = user.customClaims || {};

    customClaims.roles = mergeUnique(customClaims.roles || [], roles);
    await fAuth.setCustomUserClaims(uid, customClaims);

    res.status(200).send({
      success: true,
      roles: customClaims.roles,
    });
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const deleteRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;
  const roles = req.body as Array<string>;

  if (!(roles instanceof Array)) {
    res.status(400).send({
      code: 'Bad Request',
      message: 'Roles must be an array of string',
    });
    return;
  }

  initFireApp();
  const fAuth = auth();

  try {
    const user = await fAuth.getUser(uid);
    const customClaims = user.customClaims || {};

    customClaims.roles =
      customClaims.roles?.filter((role) => !roles.includes(role)) || [];

    await fAuth.setCustomUserClaims(uid, customClaims);

    res.status(200).send({
      success: true,
      roles: customClaims.roles,
    });
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const updatePhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;
  const { phone } = req.body;

  initFireApp();
  const fAuth = auth();

  const updateRequest: UpdateRequest = {
    phoneNumber: phone,
  };

  try {
    const result = await fAuth.updateUser(uid, updateRequest);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const updateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;
  const { email } = req.body;

  initFireApp();
  const fAuth = auth();

  const updateRequest: UpdateRequest = {
    email: email,
  };

  try {
    const result = await fAuth.updateUser(uid, updateRequest);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

/**
 * POST
 * @param req
 * @param res
 * @param next
 */
export const updatePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = req.params.uid;
  const { photoUrl } = req.body;

  if (typeof photoUrl !== 'string') {
    res.status(503).send('Invalid Photo Url format. It should be a string.');
    return;
  }

  initFireApp();
  const fAuth = auth();

  const updateRequest: UpdateRequest = {
    photoURL: photoUrl,
  };

  try {
    const result = await fAuth.updateUser(uid, updateRequest);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === AuthErrorCodes.USER_DELETED) {
      res.status(404).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};
