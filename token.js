import Jwt from "jsonwebtoken";

const generateJWTToken = userId => {
  const accessToken = Jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '29d'})

  return accessToken
};

export {generateJWTToken}
