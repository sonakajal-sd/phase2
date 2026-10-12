export function logger(req, _res, next) {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
}
