import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import UserCollection from "../db/models/User.js";
import SessionCollection from "../db/models/Session.js";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";
import jwt from 'jsonwebtoken';

import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendEmail.js';

import Handlebars from 'handlebars';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { TEMPLATES_DIR } from "../constants/index.js";

const emailTemplatePath = path.join(TEMPLATES_DIR, "verify-email.html",);

const appDomain = env("APP_DOMAIN");
const jwtSecret = env("JWT_SECRET");

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
// лист з верифікацією
export const register = async payload => {
    const { email, password } = payload;
    const user = await UserCollection.findOne({ email });
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
  const newUser = await UserCollection.create({...payload, password: hashPassword});

 const templateSource = await fs.readFile(emailTemplatePath, "utf-8");
 const template = Handlebars.compile(templateSource);
  const token = jwt.sign(
    { email },
    jwtSecret,
    { expiresIn: "1h" }
  );
 const html = template({
  link: `${appDomain}/auth/verify?token=${token}`
});

  const verifyEmail = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify email",
    html,
  };

  try {
    await sendEmail(verifyEmail);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error("Email sending failed:", error.message);
    await UserCollection.findByIdAndDelete(newUser._id);
    throw createHttpError(500, "Failed to send verification email");
  }

  return newUser;
};

export const verify = async token => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    const user = await findUser({ email });
    if (!user) {
      throw createHttpError(404, `${email} not found`);
    }
    return await UserCollection.findByIdAndUpdate(user._id, { verify: true });
  }
  catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      throw createHttpError(401, "Token is expired or invalid.");
    }
    throw error;
  }
};

export const login = async ({ email, password }) => {
    const user = await UserCollection.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Email or password invalid");
    }
    if (!user.verify) {
    throw createHttpError(401, "Email not verified");
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
    if (sessionId) {
        await SessionCollection.deleteOne({ _id: sessionId });
    }
};

// лист для зміни паролю
export const sendResetToken = async (email) => {
  try {
    const user = await UserCollection.findOne({ email });
    if (!user) {
     throw createHttpError(404, 'User not found');
    }
    const token = jwt.sign(
     {sub: user._id, email },
      jwtSecret,
     {expiresIn: '5m', }
   );

   const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
     'reset-password-email.html'
   );

   const templateSource = await fs.readFile(resetPasswordTemplatePath, 'utf-8');
   const template = Handlebars.compile(templateSource);
   const html = template({
    name: user.name,
    link: `${appDomain}/reset-password?token=${token}`,
   });

   await sendEmail({
     from: env(SMTP.SMTP_FROM),
     to: email,
     subject: 'Reset your password',
     html,
   });
 } catch (err) {
    console.error('Error in sendResetToken:', err.message);

    if (err.code === 'ENOENT') {
     throw createHttpError(500, 'Failed to read email template');
   }

   if (err.status === 404) {
     throw createHttpError(404, 'Not found');
   }
  }
};

// зміна паролю
export const resetPassword = async (payload) => {
  try {
    const entries = jwt.verify(payload.token, jwtSecret);

    const user = await UserCollection.findOne({
      email: entries.email,
      _id: entries.sub,
    });

    if (!user) {
      throw createHttpError(404, 'Not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await UserCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword }
    );

    return { message: 'Password reset successful' };
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Token is expired or invalid');
    }

    if (error.status === 404) {
      throw createHttpError(404, 'Not found');
    }

    console.error('Error in resetPassword:', error.message);
    throw createHttpError(500, 'An unexpected error occurred');
  }
};

export const findSession = filter => SessionCollection.findOne(filter);

export const findUser = filter => UserCollection.findOne(filter);


