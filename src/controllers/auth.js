import * as authServices from "../services/auth.js";

const setupSession = (res, session) => {
    const { _id, refreshToken, refreshTokenValidUntil } = session;

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });

    res.cookie("sessionId", _id, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });
};

export const registerController = async (req, res, next) => {
    try {
        const user = await authServices.register(req.body);

        const { _id, name, email, createdAt, updatedAt } = user;

        res.status(201).json({
            status: 201,
            message: 'User registered successfully!',// Please verify your email.
            data: { _id, name, email, createdAt, updatedAt },
        });
    } catch (error) {
        next(error);
    }
};

//export const verifyController = async (req, res, next) => {
   // try {
     //   const { token } = req.query;
     //   await authServices.verify(token);

      //  res.json({
       //     status: 200,
       //     message: "User verified successfully",
       // });
  //  } catch (error) {
  //      next(error);
  //  }
//};

export const loginController = async (req, res, next) => {
    try {
        const session = await authServices.login(req.body);

        setupSession(res, session);

        res.status(200).json({
            message: "Successfully logged in a user!",
            data: { accessToken: session.accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const refreshSessionController = async (req, res, next) => {
    try {
        if (!req.cookies) {
            throw new Error("No cookies found");
        }

        const session = await authServices.refreshUserSession(req.cookies);

        setupSession(res, session);

        res.status(200).json({
            message: "Successfully refreshed session!",
            data: { accessToken: session.accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const logoutController = async (req, res, next) => {
    try {
        const { sessionId } = req.cookies;

        if (sessionId) {
            await authServices.logout(sessionId);
        }

        res.clearCookie("sessionId");
        res.clearCookie("refreshToken");
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const sendResetEmailController = async (req, res, next) => {
    try {
        await authServices.sendResetToken(req.body.email);
        res.json({
            status: 200,
            message: "Reset password email was successfully sent!",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

export const resetPasswordController = async (req, res, next) => {
    try {
        await authServices.resetPassword(req.body);
        res.json({
            status: 200,
            message: "Password was successfully reset!",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

