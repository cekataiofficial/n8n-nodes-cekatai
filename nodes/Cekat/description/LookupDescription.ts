import type { INodeProperties } from 'n8n-workflow';

export const lookupOperation: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lookup'],
			},
		},
		options: [
			{
				name: 'Get Messages from Conversation',
				value: 'getMessages',
				action: 'Get all messages from a conversation',
			},
			{
				name: 'Get Subscribed Webhooks',
				value: 'getSubscribedWebhooks',
				action: 'Get all subscribed webhooks',
			},
			{
				name: 'Get List of Inboxes',
				value: 'getInboxes',
				action: 'Get all inboxes',
			},
			{
				name: 'Get Labels',
				value: 'getLabels',
				action: 'Get all labels',
			},
			{
				name: 'Get Pipeline Statuses',
				value: 'getPipelineStatuses',
				action: 'Get all pipeline statuses',
			},
			{
				name: 'Get Agents',
				value: 'getAgents',
				action: 'Get all agents',
			},
			{
				name: 'Get Templates',
				value: 'getAll',
				action: 'Get all templates',
			},
		],
		default: 'getMessages',
	},
];

export const lookupFields: INodeProperties[] = [
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['getMessages'],
			},
		},
		description: 'The ID of the conversation to get messages from',
	},
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['getSubscribedWebhooks'],
			},
		},
		description: 'The ID of the webhook to get subscribed webhooks from',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'string',
		default: '',
		hint: 'Optional. Specify the type of inbox to filter by (e.g., "email", "whatsapp")',
		displayOptions: {
			show: {
				operation: ['getInboxes'],
			},
		},
		description: 'The type of inbox to filter by (e.g., "email", "whatsapp")',
	},
];
