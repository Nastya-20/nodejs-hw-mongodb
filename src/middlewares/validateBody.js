import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';

export const validateBody = (schema) => [
  schema,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, "Validation error", { errors: errors.array() }));
    }
    next();
  },
];




