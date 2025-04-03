export function catchError(fn) {
    return (req, res, next) => {
        // Ensure fn is called and returns a promise
        Promise.resolve(fn(req, res, next)).catch((err) => {
            next(err);
        });
    };
}
