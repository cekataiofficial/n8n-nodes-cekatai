import type { INodeProperties } from 'n8n-workflow';

export const webhookOperation: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Subscribe to webhook',
				value: 'subscribe',
				action: 'subscribe to a webhook',
			},
			{
				name: 'Unsubscribe to webhook',
				value: 'unsubscribe',
				action: 'unsubscribe from a webhook',
			},
		],
		default: 'subscribe',
	},
];

export const webhookFields: INodeProperties[] = [
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		default: '',
		required: true,
		description: 'The URL to which webhook events will be sent',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['subscribe', 'unsubscribe'],
			},
		},
	},
	{
		displayName: 'Inbox ID',
		name: 'inboxId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the inbox this webhook is related to',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['subscribe', 'unsubscribe'],
			},
		},
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
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
		required: true,
		description: 'Select one or more events to subscribe/unsubscribe',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['subscribe', 'unsubscribe'],
			},
		},
	},
];
