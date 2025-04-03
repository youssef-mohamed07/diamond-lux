export const globalError = (err, req, res, next) => {
    console.error('Unhandled Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? err : undefined, // Detailed error in development only
    });
};
