"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@/app"));
const success_messages_1 = require("@/constants/success-messages");
describe('Health Check API', () => {
    it('should return 200 OK and service healthy message', async () => {
        const response = await (0, supertest_1.default)(app_1.default).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(success_messages_1.SUCCESS_MESSAGES.SERVICE_HEALTHY);
        expect(response.body.data.status).toBe('ok');
        expect(response.body.data.environment).toBe('test');
    });
    it('should include X-Request-ID header in response', async () => {
        const response = await (0, supertest_1.default)(app_1.default).get('/api/health');
        expect(response.headers['x-request-id']).toBeDefined();
        expect(typeof response.headers['x-request-id']).toBe('string');
    });
});
//# sourceMappingURL=health.test.js.map