import * as express from 'express';
import { getUsers, listUsers } from '../controllers/users.controller';
import {
  getUserById,
  getUserByEmail,
  getUserByPhone,
  getRoles,
  disableUser,
  enableUser,
  addUser,
  updateUser,
  deleteUser,
  updatePhone,
  updateEmail,
  updatePhoto,
  addRoles,
  deleteRoles,
} from '../controllers/user.controller';
import {
  getProfile,
  addProfile,
  deleteProfile,
  updateProfile,
} from '../controllers/profile.controller';
import { authenticatedGuard, adminGuard } from '../middleware';

export const usersRouter = express.Router();

// USERS
// Gets Users by identifiers. Pass identifirs to req.body
usersRouter.post('', authenticatedGuard, adminGuard, getUsers);

// Gets paginated list of users.
usersRouter.get(
  '/list/:pageSize/:nextPageToken',
  authenticatedGuard,
  adminGuard,
  listUsers
);

// USER

// Get user by Id
usersRouter.get('/uid/:uid', authenticatedGuard, adminGuard, getUserById);

// Post | disable user
usersRouter.post('/disable/:uid', disableUser);

// Post | enable user
usersRouter.post('/enable/:uid', enableUser);

// Post | add new user
usersRouter.post('/add', addUser);

// Post | update user
usersRouter.post('/update/:uid', updateUser);

// Post | delete user
usersRouter.post('/delete/:uid', deleteUser);

// PHONE

// Get user by phone
usersRouter.get('/phone/:phone', getUserByPhone);

// Post | updatePhone
usersRouter.post('/phone/update/:uid', updatePhone);

// EMAIL

// Get user by email
usersRouter.get('/email/:email', getUserByEmail);

// Post | updateEmail
usersRouter.post('/email/update/:uid', updateEmail);

// PHOTO

// Post | updatePhoto
usersRouter.post('/photo/update/:uid', updatePhoto);

// PROFILE

// Get user profile
usersRouter.get('/profile/:uid', getProfile);

// Post | add user profile
usersRouter.post('/profile/add/:uid', addProfile);

// Post | update user profile
usersRouter.post('/profile/update/:uid', updateProfile);

// Post | delete user profile
usersRouter.post('/profile/delete/:uid', deleteProfile);

// ROLES

// Get user roles
usersRouter.get('/roles/:uid', getRoles);

// Post | add user roles
usersRouter.post('/roles/add/:uid', addRoles);

// Post | delete user roles
usersRouter.post('/roles/delete/:uid', deleteRoles);
