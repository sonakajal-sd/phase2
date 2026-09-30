"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("./connection"));
async function testConnection() {
    try {
        const result = await connection_1.default.query("SELECT NOW()");
        console.log("Database connected successfully");
        console.log(result.rows[0]);
    }
    catch (error) {
        console.log("Database connnection failed:", error);
    }
    finally {
        await connection_1.default.end();
    }
}
testConnection();
