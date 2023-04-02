const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { exclude } = require("../../utils/excludeKeys");
const logger = require("simple-node-logger").createSimpleLogger();
const prisma = new PrismaClient();

module.exports = authService = {
  getUserByEmail: async (email) => {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  signUp: async (body) => {
    try {
      const { password } = body;
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = {
        ...body,
        password: hashPassword,
      };
      return prisma.user
        .create({
          data: newUser,
        })
        .then((res) => {
          return exclude(res, ["password", "createdAt", "updatedAt"]);
        });
    } catch (error) {
      logger.error("Sign up failed");
      return null;
    }
  },

  generateTokens: async (payload) => {
    try {
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFE,
      });

      if (!refreshToken) {
        logger.error("Can't not generate tokens");
        return null;
      }

      const token = await prisma.token.findUnique({
        where: { userId: payload.userId },
      });
      if (token) {
        await prisma.token.update({
          where: { userId: payload.userId },
          data: {
            refreshToken,
            expiresIn: process.env.REFRESH_TOKEN_LIFE,
          },
        });
      } else {
        await prisma.token.create({
          data: {
            userId: payload.userId,
            refreshToken,
            expiresIn: process.env.REFRESH_TOKEN_LIFE,
          },
        });
      }

      return { accessToken, refreshToken };
    } catch (error) {
      logger.error(`Error in generate tokens:  + ${error}`);
      return null;
    }
  },

  signOut: async (refreshToken) => {
    const token = await prisma.token.findUnique({ where: { refreshToken } });

    if (!token) {
      logger.error("Refresh token doesn't exist");
      return null;
    }

    return prisma.token.delete({ where: { refreshToken } });
  },

  refreshToken: async (refreshToken) => {
    try {
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
      const token = await prisma.token.findUnique({ where: { refreshToken } });
      if (!token) {
        return null;
      }
      const decoded = jwt.verify(refreshToken, refreshTokenSecret);
      if (!decoded) {
        return null;
      }

      const { userId } = decoded;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        logger.error("User was not found");
        return null;
      }

      const payload = {
        userId: user.id,
        email: user.email,
      };

      return {
        accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_LIFE,
        }),
      };
    } catch (error) {
      logger.error(error);
      return null;
    }
  },
};
