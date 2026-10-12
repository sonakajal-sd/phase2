// Express 5 forwards rejected promises from async handlers here.
export function errorHandler(err, _req, res, _next) {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON body" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
}
