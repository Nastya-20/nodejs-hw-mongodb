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

        const { _id, username, email, createdAt, updatedAt } = user;

        res.status(201).json({
            status: 201,
            message: "Successfully registered a user",
            data: {
                name: username,
                email,
                _id,
                createdAt,
                updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};


export const loginController = async (req, res, next) => {
    try {
        const session = await authServices.login(req.body);

        setupSession(res, session);

        res.status(200).json({
            status: 200,
            message: "Successfully logged in an user!",
            data: {
                accessToken: session.accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const refreshSessionController = async (req, res) => {
    const session = await authServices.refreshUserSession(req.cookies);

    setupSession(res, session);

        res.status(200).json({
            status: 200,
            message: "Successfully refresh session",
            data: {
                accessToken: session.accessToken,
            },
        });
};

export const logoutController = async (req, res) => {
    if (!req.cookies.sessionId) {
        await authServices.logout(req.cookies.sessionId);
    }
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
};

