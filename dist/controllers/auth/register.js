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
exports.default = register;
const argon2_1 = __importDefault(require("argon2"));
const users_1 = __importDefault(require("../../models/users"));
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Simulated registration logic
            const { name, password } = req.body;
            const hashedPassword = yield argon2_1.default.hash(password);
            const unique = yield users_1.default.findOne({ $or: [{ name }] });
            if (unique) {
                res.status(400).json({
                    succuss: false,
                    message: 'Name is already taken'
                });
                return;
            }
            const newUser = yield users_1.default.insertOne({
                name,
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date()
            });
            res.status(201).json({
                succuss: true,
                message: 'User registered successfully',
                data: {
                    _id: newUser.insertedId,
                    name,
                    role: 'admin',
                    createdAt: new Date()
                }
            });
        }
        catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                succuss: false,
                message: 'An error occurred while registering'
            });
            return;
        }
    });
}
