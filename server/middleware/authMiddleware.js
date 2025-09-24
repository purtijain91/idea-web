const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  console.log("i am in protected routes")
  const token = req.cookies.accessToken;
  console.log("token of user", token)
  if (!token) return res.status(401).json({ error: "Unauthorised User" });
console.log("bhai me try k upar hu")
  try {
    console.log("mein try k andar hu")
    console.log("token try k andar",token)
    console.log("jwt access secret",process.env.JWT_ACCESS_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("decoded id",decoded)
    req.user = decoded.id;
    console.log("req user",req.user)
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { protect };
