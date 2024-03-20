export const currentUserGuard = async (req, res, next) => {
  const currentUser = req.currentUser;
  const uid = req.params?.uid;

  if (currentUser && currentUser.uid === uid) {
    next();
  } else {
    res.status(403).send({
      code: 'unauthorized',
      message: 'User is not Author.',
    });
  }
};
