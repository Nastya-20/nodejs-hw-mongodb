export const errorHandler = (error, req, res, next) => {
    const { status = 500, message = "Something went wrong", data } = error;

    res.status(status).json({
        status,
        message,
        data: {
            message: data?.message || "Bad request",
            errors: data?.errors || null, 
        },
    });
};

