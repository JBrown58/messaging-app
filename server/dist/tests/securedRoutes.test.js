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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = require("supertest");
var express_1 = require("express");
var mongoConfigTesting_1 = require("./mongoConfigTesting");
var secureRoutes_1 = require("../routes/secureRoutes");
var routes_1 = require("../routes/routes");
var auth_1 = require("../auth/auth");
var message_1 = require("../models/message");
var messageData_1 = require("./messageData");
var userData_1 = require("./userData");
var user_1 = require("../models/user");
var app = (0, express_1.default)();
(0, mongoConfigTesting_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(auth_1.default.initialize());
app.use("/", secureRoutes_1.default);
app.use("/", routes_1.default);
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, message_1.default.insertMany(messageData_1.default)];
            case 1:
                _a.sent();
                return [4 /*yield*/, user_1.default.insertMany(userData_1.default)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
describe("Navigate to Home Page", function () {
    var testUser = {
        _id: "651b3a462edfb41fa6ba48e1",
        username: "testUser",
        password: "testPassword",
        messages: [],
        __v: 0,
    };
    it("should create a new user and return a successful signup message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/signup").send(testUser)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe("Signup successful");
                    expect(response.body.user).toBeDefined();
                    expect(response.body.user.username).toBe(testUser.username);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should login if username and password are correct", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/login").send(testUser)];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe("Logged in Successfully");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return list of users and token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var test, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/login").send(testUser)];
                case 1:
                    test = _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/home")
                            .set("Authorization", "Bearer " + test.body.token)];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.users).toBeDefined();
                    expect(response.body.token).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it("get profile info", function () { return __awaiter(void 0, void 0, void 0, function () {
        var test, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/login").send(testUser)];
                case 1:
                    test = _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/user/6517c7d8d949e4b87f7b6b53/profile")
                            .set("Authorization", "Bearer " + test.body.token)];
                case 2:
                    data = _a.sent();
                    expect(data.body.user).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return messages array", function () { return __awaiter(void 0, void 0, void 0, function () {
        var test, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/login").send(testUser)];
                case 1:
                    test = _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/user/651b3a462edfb41fa6ba48e1/chat")
                            .set("Authorization", "Bearer " + test.body.token)];
                case 2:
                    data = _a.sent();
                    expect(data.body).toBeDefined();
                    expect(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return new message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var test, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/login").send(testUser)];
                case 1:
                    test = _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post("/user/651b3a462edfb41fa6ba48e1/chat")
                            .set("Authorization", "Bearer " + test.body.token)
                            .query({ userid: "651b3a462edfb41fa6ba48e1" })
                            .send({
                            message: "Im there already.",
                            recipient: "651b3a462edfb41fa6ba48e1",
                        })];
                case 2:
                    data = _a.sent();
                    expect(data.body).toBeDefined();
                    expect(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should update a message content", function () { return __awaiter(void 0, void 0, void 0, function () {
        var test, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/login").send(testUser)];
                case 1:
                    test = _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .put("/user/651b3a462edfb41fa6ba48e1/chat")
                            .set("Authorization", "Bearer " + test.body.token)
                            .send({
                            message: "Take your time Man",
                            messageId: "651bc2e5ff87ebc66275a4e4",
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.Message).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should delete a message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var test, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/login").send(testUser)];
                case 1:
                    test = _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .delete("/user/651b3a462edfb41fa6ba48e1/chat")
                            .set("Authorization", "Bearer " + test.body.token)
                            .send({
                            messageId: "651bc2e5ff87ebc66275a4e4",
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
