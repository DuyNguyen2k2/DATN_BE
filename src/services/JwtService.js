const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const genneralAccessToken = (payload) => {
  const access_token = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "3d" }
  );

  return access_token;
};

const genneralRefreshToken = (payload) => {
  const refresh_token = jwt.sign(
    {
      ...payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "2h" }
  );

  return refresh_token;
};

const refreshTokenJWTService = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
          resolve({
            status: "ERROR",
            message: "The authentication",
          });
        }
        const newAccessToken = genneralAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin,
        });
        resolve({
          status: "OK",
          message: "Refresh token successfully",
          accessToken: newAccessToken,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJWTService,
};
