export const authorGuard = async (req, res, next) => {
  const currentUser = req.currentUser;

  if (currentUser && currentUser.author) {
    next();
  } else {
    res.status(403).send({
      code: 'unauthorized',
      message: 'User is not Author.',
    });
  }
};
