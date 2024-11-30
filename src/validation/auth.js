import Joi from "joi";
import { emailRegex } from "../constants/users.js";

// signup
export const authRegisterSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
});

// signin
export const authLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
});

export const resetPwdSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),
  token: Joi.string().required(),
});

export const authOAuthGoogleSchema = Joi.object({
  code: Joi.string().required(),
});


