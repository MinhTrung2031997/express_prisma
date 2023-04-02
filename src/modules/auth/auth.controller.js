const authService = require("./auth.service");
const bcrypt = require("bcrypt");
const {
  signUpBodyValidation,
  signIn,
  signOut,
  refreshTokenBodyValidation,
} = require("../../validations/auth.validate");
const { exclude } = require("../../utils/excludeKeys");

module.exports = authController = {
  signUp: async (req, res, next) => {
    const { error } = signUpBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const { email } = req.body;
    try {
      const user = await authService.getUserByEmail(email);
      if (user) {
        return res
          .status(409)
          .send("The email has existed. Please use another email");
      }
      const newUser = await authService.signUp(req.body);
      if (!newUser) {
        return res
          .status(400)
          .send("Can not create an user, please try again.");
      }
      res.status(201).json({
        error: false,
        data: {
          ...newUser,
          displayName: `${newUser.firstName} ${newUser.lastName}`,
        },
        message: "Account created sucessfully",
      });
    } catch (error) {
      next(error);
    }
  },

  signIn: async (req, res, next) => {
    const { error } = signIn(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    try {
      const { password, email } = req.body;
      const user = await authService.getUserByEmail(email);
      if (!user) {
        return res.status(400).send("The email doesn't exist.");
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send("The password invalid.");
      }
      const { id } = user;
      const payload = {
        userId: id,
        email,
      };
      const token = await authService.generateTokens(payload);
      if (!token) {
        return res.status(401).send("Sign up failed, please try again.");
      }

      const resUser = {
        ...exclude(user, ["password", "createdAt", "updatedAt"]),
        displayName: `${user.firstName} ${user.lastName}`,
      };

      return res.json({
        msg: "sign in successfully",
        user: resUser,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  },

  signOut: async (req, res, next) => {
    const { error } = signOut(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    try {
      const { refreshToken } = req.body;
      const token = await authService.signOut(refreshToken);

      if (!token) {
        return res.status(400).send("The refresh token doesn't exist ");
      }

      return res.json({
        msg: "sign out successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      if (!result) {
        return res.status(400).send("Refresh token invalid");
      }

      return res.json({
        msg: "Refresh token successfully",
        accessToken: result.accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  },
};
