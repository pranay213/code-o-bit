"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@/app"));
const success_messages_1 = require("@/constants/success-messages");
const error_messages_1 = require("@/constants/error-messages");
const user_model_1 = require("@/modules/users/user.model");
const roles_1 = require("@/constants/roles");
describe('Problems API', () => {
    let adminToken;
    let userToken;
    const testProblem = {
        title: 'Two Sum',
        slug: 'two-sum',
        description: 'Given an array of integers...',
        difficulty: 'easy',
        timeLimit: 1000,
        memoryLimit: 256,
        testCases: [{ input: '1 2', expectedOutput: '3', isPublic: true }],
        isPublished: true,
    };
    beforeEach(async () => {
        await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
            username: 'adminuser',
            email: 'admin@example.com',
            password: 'Password123!',
        });
        await user_model_1.UserModel.updateOne({ email: 'admin@example.com' }, { role: roles_1.ROLES.ADMIN });
        const adminLogin = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
            email: 'admin@example.com',
            password: 'Password123!',
        });
        adminToken = adminLogin.body.data.tokens.accessToken;
        await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
            username: 'regularuser',
            email: 'user@example.com',
            password: 'Password123!',
        });
        const userLogin = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
            email: 'user@example.com',
            password: 'Password123!',
        });
        if (!userLogin.body.data)
            console.log('userLogin failed:', userLogin.body);
        userToken = userLogin.body.data.tokens.accessToken;
    });
    describe('POST /api/problems', () => {
        it('should allow admin to create a problem', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/problems')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(testProblem);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(success_messages_1.SUCCESS_MESSAGES.PROBLEM_CREATED);
            expect(response.body.data.slug).toBe(testProblem.slug);
        });
        it('should reject non-admin from creating a problem', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/problems')
                .set('Authorization', `Bearer ${userToken}`)
                .send(testProblem);
            expect(response.status).toBe(403);
            expect(response.body.message).toBe(error_messages_1.ERROR_MESSAGES.FORBIDDEN);
        });
    });
    describe('GET /api/problems', () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app_1.default)
                .post('/api/problems')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(testProblem);
        });
        it('should return a list of problems', async () => {
            const response = await (0, supertest_1.default)(app_1.default).get('/api/problems');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(success_messages_1.SUCCESS_MESSAGES.PROBLEMS_FETCHED);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.data[0].title).toBe(testProblem.title);
        });
    });
});
//# sourceMappingURL=problems.test.js.map