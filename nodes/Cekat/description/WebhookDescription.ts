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
