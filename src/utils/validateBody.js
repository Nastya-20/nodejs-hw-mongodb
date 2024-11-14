import createHttpError from "http-errors";

export default function validateBody(schema) {
    return async (req, res, next) => {
        try {
            const { error } = schema.validate(req.body, {
                abortEarly: false,
            });

            if (error) {
                const errorDetails = error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path,
                    type: detail.type,
                    context: detail.context,
                }));

                const validationError = createHttpError(400, "Bad Request", {
                    status: 400,
                    message: "BadRequestError",
                    data: {
                        message: "Bad request",
                        errors: errorDetails,
                    },
                });

                return next(validationError);
            }
            next();
        } catch (err) {
            next(err);
        }
    };
}


