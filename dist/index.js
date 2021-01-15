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
const connection_1 = require("./connection");
const express_1 = __importDefault(require("express"));
const User_1 = require("./entities/User");
const port = process.env.PORT || 3000;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_1.connection;
    const app = express_1.default();
    try {
        yield User_1.User.create({ username: "Martin", password: "Password", email: "email", salt: "salt" }).save();
    }
    catch (err) {
        console.log(err);
    }
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.disable('x-powered-by');
    app.get('/', (req, res) => {
        res.send("hello world");
    });
    app.get('/register', (req, res) => {
        res.send("Nikita is dumb");
    });
    app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { username, password, email } = req.body;
        res.json(req.body);
    }));
    app.listen(port, () => {
        console.log(`server started on http://localhost:${port}`);
    });
});
main();
//# sourceMappingURL=index.js.map