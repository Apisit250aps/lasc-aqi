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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
const register_1 = __importDefault(require("./controllers/auth/register"));
const config_1 = __importDefault(require("./config"));
const login_1 = __importDefault(require("./controllers/auth/login"));
const aqiView_1 = __importDefault(require("./controllers/page/aqiView"));
const loginView_1 = __importDefault(require("./controllers/page/loginView"));
const AdminView_1 = __importDefault(require("./controllers/page/AdminView"));
const authenticated_1 = require("./middlewares/authenticated");
const createDevice_1 = __importDefault(require("./controllers/device/createDevice"));
const getDevice_1 = __importDefault(require("./controllers/device/getDevice"));
const morgan_1 = __importDefault(require("morgan"));
const recordAir_1 = __importDefault(require("./controllers/air/recordAir"));
// Initialize express app
const app = (0, express_1.default)();
// Set view engine
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Parse JSON body
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.get('/', aqiView_1.default);
app.get('/login', loginView_1.default);
app.get('/admin', authenticated_1.authenticate, AdminView_1.default);
// Api
app.post('/api/auth/register', register_1.default);
app.post('/api/auth/login', login_1.default);
// Device API
app.get('/api/device', getDevice_1.default);
app.post('/api/device', createDevice_1.default);
app.post('/api/air/record/:id', recordAir_1.default);
// Start server
app.listen(config_1.default.port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.connectDB)();
    console.log(`Server running at http://localhost:${config_1.default.port}`);
}));
