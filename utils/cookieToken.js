const cookieToken = (user, res) => {
  const token = user.getJwtToken();

  const opition = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  user.password = undefined;
  res.status(200).cookie("token", token, opition).json({
    success: true,
    token,
    user,
  });
};
