function logErrorHandlers(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

export default { logErrorHandlers };
