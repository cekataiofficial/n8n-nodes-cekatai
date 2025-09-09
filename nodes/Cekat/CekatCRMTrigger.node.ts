import {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
} from 'n8n-workflow';
import { cekatApiRequest } from '../Cekat/GenericFunctions';
import * as options from '../Cekat/methods';

export class CekatCRMTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cekat CRM Trigger',
		name: 'cekatCrmTrigger',
		group: ['trigger'],
		version: 1,
		description: 'Trigger node for receiving Cekat CRM webhooks',
		icon: 'file:cekat.svg',
		defaults: {
			name: 'Cekat CRM Trigger',
		},
		inputs: [],
		outputs: ['main' as any],
		credentials: [
			{
				name: 'CekatOpenApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Board',
				name: 'board_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getBoards',
				},
				required: false,
				default: '',
				description: 'Select a board for this trigger (optional)',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				options: [
					{ name: 'CRM Item Created', value: 'crm_item.created' },
					{ name: 'CRM Item Updated', value: 'crm_item.updated' },
					{ name: 'CRM Item Deleted', value: 'crm_item.deleted' },
					{ name: 'CRM Value Upserted', value: 'crm_value.upserted' },
					{ name: 'CRM Value Deleted', value: 'crm_value.deleted' },
				],
				default: [],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: ITriggerFunctions): Promise<boolean> {
				const res = await cekatApiRequest.call(
					this,
					'GET',
					'/business_workflows/webhooks',
					{},
					{},
					'server',
				);
				return Array.isArray(res) && res.length > 0;
			},

			async create(this: ITriggerFunctions): Promise<boolean> {
				const events = this.getNodeParameter('events') as string[];
				const webhookUrl = this.getNodeWebhookUrl('default');
				const boardId = this.getNodeParameter('board_id', '') as string;

				const payload: any = {
					name: 'N8N CRM Webhook',
					webhookUrl: webhookUrl,
					events: events,
				};

				// Hanya tambahkan board_id jika ada value
				if (boardId) {
					payload.boardId = boardId;
				}


				await cekatApiRequest.call(this, 'POST', '/business_workflows/webhooks/subscribe', payload, {}, 'server');
				return true;
			},

			async delete(this: ITriggerFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				
				// First get webhook ID
				await cekatApiRequest.call(
					this,
					'POST',
					'/business_workflows/webhooks/unsubscribe',
					{ webhookUrl },
					'server',
				);

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<any> {
		const body = this.getBodyData();
		return {
			workflowData: [[{ json: body }]],
		};
	}

	methods = {
		loadOptions: {
			...options,
		},
	};
}
