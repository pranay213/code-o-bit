"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@/app"));
const success_messages_1 = require("@/constants/success-messages");
const error_messages_1 = require("@/constants/error-messages");
describe('Auth API', () => {
    const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
    };
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(testUser);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(success_messages_1.SUCCESS_MESSAGES.REGISTERED);
            expect(response.body.data.user.email).toBe(testUser.email);
            expect(response.body.data.user.username).toBe(testUser.username);
            expect(response.body.data.tokens.accessToken).toBeDefined();
        });
        it('should fail if email is already taken', async () => {
            await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(testUser);
            const response = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                ...testUser,
                username: 'anotherusername',
            });
            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(error_messages_1.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        });
        it('should fail with invalid email format', async () => {
            const response = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                ...testUser,
                email: 'not-an-email',
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(error_messages_1.ERROR_MESSAGES.VALIDATION_FAILED);
        });
    });
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(testUser);
        });
        it('should login successfully with correct credentials', async () => {
            const response = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: testUser.email,
                password: testUser.password,
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(success_messages_1.SUCCESS_MESSAGES.LOGGED_IN);
            expect(response.body.data.tokens.accessToken).toBeDefined();
        });
        it('should fail with incorrect password', async () => {
            const response = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: testUser.email,
                password: 'WrongPassword123!',
            });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(error_messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        });
    });
});
//# sourceMappingURL=auth.test.js.map