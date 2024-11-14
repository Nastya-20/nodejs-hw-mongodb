import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import UserColletion from "../db/models/User.js";
import SessionCollection from "../db/models/Session.js";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";

const createSession = () => {
    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");
    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: Date.now() + accessTokenLifeTime,
        refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
    };
};

export const register = async payload => {
    const { email, password } = payload;

    const user = await UserColletion.findOne({ email });
    if (user) {
        throw createHttpError(409, {
            status: 409,
            message: "ConflictError",
            data: {
                message: "Email in use",
            },
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return UserColletion.create({...payload, password: hashPassword});
};

export const login = async ({ email, password }) => {
    const user = await UserColletion.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, "Email or password invalid");
    }
    await SessionCollection.deleteOne({ userId: user._id });

    const newSession = createSession();

    return SessionCollection.create({
        userId: user._id,
        ...newSession,
    });
};

export const refreshUserSession = async ({sessionId, refreshToken}) => {
    const session = await SessionCollection.findOne({ _id: sessionId, refreshToken });
    if (!session) {
        throw createHttpError(401, "Session not found");
    }
    if (Date.now() > session.refreshTokenValidUntil) {
        throw createHttpError(401, "Session token expired");
    }
    await SessionCollection.deleteOne({ _id: session._id });

    const newSession = createSession();

    return SessionCollection.create({
        userId: session.userId,
        ...newSession,
    });
};

export const logout = async (sessionId) => {
    await SessionCollection.deleteOne({_id: sessionId});
};

export const findSession = filter => SessionCollection.findOne(filter);

export const findUser = filter => UserColletion.findOne(filter);


