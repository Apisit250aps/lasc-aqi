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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = req.params;
            res.json({
                success: true,
                message: 'Air quality data fetched successfully',
                data: params
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
