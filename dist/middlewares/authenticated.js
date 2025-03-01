"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const authenticate = (req, res, next) => {
    const token = req.cookies.token; // ดึง token จาก Cookie
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        req.user = decoded; // เก็บข้อมูลผู้ใช้ไว้ใน req
        next(); // ดำเนินการต่อไปยัง route ถัดไป
    }
    catch (_a) {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};
exports.authenticate = authenticate;
