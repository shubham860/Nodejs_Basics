class AppError extends Error{
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.success = `${statusCode}`.startsWith('4') ? false : 'error'
        this.isOperational = true,

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;