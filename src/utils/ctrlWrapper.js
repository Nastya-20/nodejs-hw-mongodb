const ctrlWrapper = getContactByIdController => {
    const func = async (req, res, next) => {
        try {
            await getContactByIdController(req, res, next);
        } catch (error) {
            next(error);
        }
    };
    return func;
};

export default ctrlWrapper;
