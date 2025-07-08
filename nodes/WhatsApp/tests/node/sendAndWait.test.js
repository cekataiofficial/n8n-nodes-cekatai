'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jest_mock_extended_1 = require('jest-mock-extended');
const WhatsApp_node_1 = require('../../WhatsApp.node');
describe('Test WhatsApp Business Cloud, sendAndWait operation', () => {
	let whatsApp;
	let mockExecuteFunctions;
	beforeEach(() => {
		whatsApp = new WhatsApp_node_1.WhatsApp();
		mockExecuteFunctions = (0, jest_mock_extended_1.mock)();
		mockExecuteFunctions.helpers = {
			httpRequestWithAuthentication: jest.fn().mockResolvedValue({}),
		};
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	it('should send message and put execution to wait', async () => {
		const items = [{ json: { data: 'test' } }];
		mockExecuteFunctions.getNodeParameter.mockImplementation((key) => {
			if (key === 'phoneNumberId') return '11111';
			if (key === 'recipientPhoneNumber') return '22222';
			if (key === 'message') return 'my message';
			if (key === 'subject') return '';
			if (key === 'approvalOptions.values') return {};
			if (key === 'responseType') return 'approval';
			if (key === 'sendTo') return 'channel';
			if (key === 'channelId') return 'channelID';
			if (key === 'options.limitWaitTime.values') return {};
		});
		mockExecuteFunctions.putExecutionToWait.mockImplementation();
		mockExecuteFunctions.getInputData.mockReturnValue(items);
		mockExecuteFunctions.getInstanceId.mockReturnValue('instanceId');
		mockExecuteFunctions.evaluateExpression.mockReturnValueOnce('http://localhost/waiting-webhook');
		mockExecuteFunctions.evaluateExpression.mockReturnValueOnce('nodeID');
		const result = await whatsApp.customOperations.message.sendAndWait.call(mockExecuteFunctions);
		expect(result).toEqual([items]);
		expect(mockExecuteFunctions.putExecutionToWait).toHaveBeenCalledTimes(1);
		expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
			'whatsAppApi',
			{
				baseURL: 'https://graph.facebook.com/v13.0/',
				body: {
					messaging_product: 'whatsapp',
					text: {
						body: 'my message\n\n*Approve:*\n_http://localhost/waiting-webhook/nodeID?approved=true_\n\n',
					},
					to: '22222',
					type: 'text',
				},
				method: 'POST',
				url: '11111/messages',
			},
		);
	});
});
//# sourceMappingURL=sendAndWait.test.js.map
