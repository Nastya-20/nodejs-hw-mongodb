import createHttpError from "http-errors";

export default function validateBody(schema) {
    return async (req, res, next) => {
        try {
           await schema.validateAsync(req.body, {
                abortEarly: false,
            });
            next();
        } catch (err) {
            const errorDetails = err.details.map(detail => ({
                message: detail.message,
                path: detail.path,
                type: detail.type,
                context: detail.context,
            }));

           const error = createHttpError(400, "Bad Request", {
                status: 400,
                message: "BadRequestError",
                data: {
                    message: "Bad request",
                    errors: errorDetails,
                },
            });

            next(error);
        }
    };
}

