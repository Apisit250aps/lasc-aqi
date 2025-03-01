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
exports.default = default_1;
const devices_1 = __importDefault(require("../../models/devices"));
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, location } = req.body;
            if (!name || !location) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid input'
                });
                return;
            }
            const unique = yield devices_1.default.findOne({ $and: [{ name }, { location }] });
            if (unique) {
                res.status(400).json({
                    success: false,
                    message: 'Device already exists'
                });
                return;
            }
            // Create device
            const newDevice = yield devices_1.default.insertOne({
                name,
                location,
                createdAt: new Date()
            });
            if (!newDevice.acknowledged) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create device'
                });
                return;
            }
            const createdDevice = yield devices_1.default.findOne({ _id: newDevice.insertedId });
            if (!createdDevice) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch created device'
                });
                return;
            }
            res.json({
                success: true,
                message: 'Device created successfully',
                data: createdDevice
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    });
}
