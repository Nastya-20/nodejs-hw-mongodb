import Joi from "joi";
import { emailRegex } from "../constants/users.js";

// signup
export const authRegisterSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
});

// signin
export const authLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
