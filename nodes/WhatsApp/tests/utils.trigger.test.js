'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const WhatsAppTrigger_node_1 = require('../WhatsAppTrigger.node');
describe('filterStatuses', () => {
	const mockEvents = [
		{ statuses: [{ status: 'deleted' }] },
		{ statuses: [{ status: 'delivered' }] },
		{ statuses: [{ status: 'failed' }] },
		{ statuses: [{ status: 'read' }] },
		{ statuses: [{ status: 'sent' }] },
	];
	test('returns events with no statuses when allowedStatuses is empty', () => {
		expect((0, WhatsAppTrigger_node_1.filterStatuses)(mockEvents, [])).toEqual([]);
	});
	test("returns all events when 'all' is in allowedStatuses", () => {
		expect((0, WhatsAppTrigger_node_1.filterStatuses)(mockEvents, ['all'])).toEqual(mockEvents);
	});
	test('filters events correctly when specific statuses are provided', () => {
		expect((0, WhatsAppTrigger_node_1.filterStatuses)(mockEvents, ['deleted', 'read'])).toEqual([
			{ statuses: [{ status: 'deleted' }] },
			{ statuses: [{ status: 'read' }] },
		]);
	});
	test('returns only event with matching status', () => {
		expect((0, WhatsAppTrigger_node_1.filterStatuses)(mockEvents, ['failed'])).toEqual([
			{ statuses: [{ status: 'failed' }] },
		]);
	});
	test('returns unchanged event when allowedStatuses is undefined', () => {
		expect((0, WhatsAppTrigger_node_1.filterStatuses)(mockEvents, undefined)).toEqual(mockEvents);
	});
});
//# sourceMappingURL=utils.trigger.test.js.map
