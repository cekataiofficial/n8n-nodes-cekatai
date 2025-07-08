import {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	NodeConnectionTypes
} from 'n8n-workflow';
import { cekatApiRequest } from '../Cekat/GenericFunctions';
import * as options from '../Cekat/methods';

export class CekatTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cekat Trigger',
		name: 'cekatTrigger',
		group: ['trigger'],
		version: 1,
		description: 'Trigger node for receiving Cekat webhooks',
		icon: 'file:cekat.svg',
		defaults: {
			name: 'Cekat Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
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
				displayName: 'Inbox',
				name: 'inbox_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getInboxes',
				},
				required: false,
				default: '',
				description: 'Select an inbox for this trigger',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				options: [
					{ name: 'Message Received', value: 'message.received' },
					{ name: 'Message Sent', value: 'message.sent' },
					{ name: 'Conversation Created', value: 'conversation.created' },
					{ name: 'Handled By Updated', value: 'conversation.handled_by_updated' },
					{ name: 'Stage Status Updated', value: 'conversation.stage_status_updated' },
					{ name: 'Pipeline Status Updated', value: 'conversation.pipeline_status_updated' },
					{ name: 'Labels Updated', value: 'conversation.labels_updated' },
					{ name: 'Contact Updated', value: 'contact.updated' },
				],
				default: [],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: ITriggerFunctions) {
				// Optionally implement deduplication logic here
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const inboxId = this.getNodeParameter('inbox_id') as string;

				const response = await cekatApiRequest.call(
					this,
					'GET',
					'/business_workflows/webhooks',
					{},
					{
						webhookUrl,
						inboxId,
					},
					'server',
				);

				if (response.length > 0) {
					return true;
				}

				return false;
			},

			async create(this: ITriggerFunctions) {
				const events = this.getNodeParameter('events') as string[];
				const webhookUrl = this.getNodeWebhookUrl('default');
				const inboxId = this.getNodeParameter('inbox_id') as string;

				await cekatApiRequest.call(
					this,
					'POST',
					'/business_workflows/webhooks/subscribe',
					{
						events,
						webhookUrl,
						inboxId,
					},
					'server',
				);

				return true;
			},

			async delete(this: ITriggerFunctions) {
				const events = this.getNodeParameter('events') as string[];
				const webhookUrl = this.getNodeWebhookUrl('default');
				const inboxId = this.getNodeParameter('inbox_id') as string;

				await cekatApiRequest.call(
					this,
					'POST',
					'/business_workflows/webhooks/unsubscribe',
					{
						events,
						webhookUrl,
						inboxId,
					},
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
		loadOptions: { ...options },
	};
}
