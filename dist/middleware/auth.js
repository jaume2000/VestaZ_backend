"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        res.status(401).send('Access denied.');
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(400).send('Invalid token.');
    }
};
exports.auth = auth;
const permission = (role) => (req, res, next) => {
    const user = req.user;
    if (!user) {
        res.status(401).send('Access denied.');
        return;
    }
    if (user.role !== role) {
        res.status(403).send('Access denied.');
        return;
    }
    next();
};
exports.permission = permission;
