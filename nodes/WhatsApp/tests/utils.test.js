'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const GenericFunctions_1 = require('../GenericFunctions');
const MessageFunctions_1 = require('../MessageFunctions');
describe('sanitizePhoneNumber', () => {
	const testNumber = '+99-(000)-111-2222';
	it('should remove hyphens, parentheses, and plus signs from the phone number', () => {
		expect((0, MessageFunctions_1.sanitizePhoneNumber)(testNumber)).toBe('990001112222');
	});
	it('should return an empty string if input is empty', () => {
		expect((0, MessageFunctions_1.sanitizePhoneNumber)('')).toBe('');
	});
	it('should return the same number if no special characters are present', () => {
		expect((0, MessageFunctions_1.sanitizePhoneNumber)('990001112222')).toBe('990001112222');
	});
	it('should handle numbers with spaces correctly (not removing them)', () => {
		expect((0, MessageFunctions_1.sanitizePhoneNumber)('+99 000 111 2222')).toBe('99 000 111 2222');
	});
});
describe('createMessage', () => {
	const mockSendAndWaitConfig = {
		title: '',
		message: 'Please approve an option:',
		url: 'https://example.com/approve',
		options: [
			{ label: 'Yes', value: 'yes', style: 'primary' },
			{ label: 'No', value: 'no', style: 'secondary' },
		],
	};
	const phoneID = '123456789';
	const recipientPhone = '990001112222';
	it('should return a valid HTTP request object', () => {
		const request = (0, GenericFunctions_1.createMessage)(
			mockSendAndWaitConfig,
			phoneID,
			recipientPhone,
			'',
		);
		expect(request).toEqual({
			baseURL: GenericFunctions_1.WHATSAPP_BASE_URL,
			method: 'POST',
			url: `${phoneID}/messages`,
			body: {
				messaging_product: 'whatsapp',
				text: {
					body:
						'Please approve an option:\n\n' +
						'*Yes:*\n_https://example.com/approve?approved=yes_\n\n' +
						'*No:*\n_https://example.com/approve?approved=no_\n\n',
				},
				type: 'text',
				to: recipientPhone,
			},
		});
	});
	it('should handle a single option correctly', () => {
		const singleOptionConfig = {
			title: '',
			message: 'Choose an option:',
			url: 'https://example.com/approve',
			options: [
				{
					label: 'Confirm',
					value: 'confirm',
					style: '',
				},
			],
		};
		const request = (0, GenericFunctions_1.createMessage)(
			singleOptionConfig,
			phoneID,
			recipientPhone,
			'',
		);
		expect(request).toEqual({
			baseURL: GenericFunctions_1.WHATSAPP_BASE_URL,
			method: 'POST',
			url: `${phoneID}/messages`,
			body: {
				messaging_product: 'whatsapp',
				text: {
					body: 'Choose an option:\n\n*Confirm:*\n_https://example.com/approve?approved=confirm_\n\n',
				},
				type: 'text',
				to: recipientPhone,
			},
		});
	});
});
//# sourceMappingURL=utils.test.js.map
