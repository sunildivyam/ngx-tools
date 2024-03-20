export const adminGuard = async (req, res, next) => {
  const currentUser = req.currentUser;

  if (currentUser && currentUser.admin) {
    next();
  } else {
    res.status(403).send({
      code: 'unauthorized',
      message: 'User is not admin.',
    });
  }
};
