import Joi from "joi";
import { typeList } from "../constants/contacts.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Username should be a string',
        'string.min': 'Username should have at least {#limit} characters',
        'string.max': 'Username should have at most {#limit} characters',
        "any.required": `Username is required`,
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        'string.base': 'PhoneNumber should be a string',
        'string.min': 'PhoneNumber should have at least {#limit} characters',
        'string.max': 'PhoneNumber should have at most {#limit} characters',
        "any.required": `PhoneNumber is required`,
    }),
    contactType: Joi.string().min(3).max(20).valid(...typeList).default("personal").messages({
        'string.base': 'ContactType should be a string',
        'string.min': 'ContactType should have at least {#limit} characters',
        'string.max': 'ContactType should have at most {#limit} characters',
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).message({'string.email':'Invalid email format'}),
    isFavourite: Joi.boolean().default(false)
});

export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(20).messages({
        'string.base': 'Username should be a string',
        'string.min': 'Username should have at least {#limit} characters',
        'string.max': 'Username should have at most {#limit} characters',
        "any.required": `Username is required`,
    }),
    phoneNumber: Joi.string().min(3).max(20).messages({
        'string.base': 'PhoneNumber should be a string',
        'string.min': 'PhoneNumber should have at least {#limit} characters',
        'string.max': 'PhoneNumber should have at most {#limit} characters',
        "any.required": `PhoneNumber is required`,
    }),
    contactType: Joi.string().min(3).max(20).valid(...typeList),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).message('Invalid email format'),
    isFavourite: Joi.boolean(),
    photo: Joi.string().optional(),
}).min(1);
