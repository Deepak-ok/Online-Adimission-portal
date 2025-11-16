const jwt = require('jsonwebtoken');

const userSetInfo = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.Secret_key);
      req.user = decoded;  // so you can still use req.user
      console.log(req.user)
      res.locals.name = decoded.name;
      res.locals.role = decoded.role;
      res.locals.password =decoded.password
    } catch (err) {
      res.locals.name = null;
      res.locals.role = null;
    }
  } else {
res.locals.name = null;
    res.locals.role = null;
  }
  next();
};

module.exports = userSetInfo;