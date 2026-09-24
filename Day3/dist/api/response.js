import { createServer, ServerResponse } from "node:http";
export function sendResponse(res, statusCode, data) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
}
//# sourceMappingURL=response.js.map