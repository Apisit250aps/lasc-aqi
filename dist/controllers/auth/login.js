"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = login;
const users_1 = __importDefault(require("../../models/users"));
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, password } = req.body;
            const user = yield users_1.default.findOne({
                name
            });
            if (!user) {
                res.status(400).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            const validPassword = argon2_1.default.verify(user.password, password);
            if (!validPassword) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid password'
                });
                return;
            }
            const token = jsonwebtoken_1.default.sign(user, config_1.default.jwtSecret, {
                expiresIn: '1d'
            });
            res
                .cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            })
                .json({
                success: true,
                message: 'Logged in successfully'
            });
        }
        catch (error) { }
    });
}
