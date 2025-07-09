import type { INodeProperties } from 'n8n-workflow';

export const contactOperation: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Update Additional Data',
				value: 'updateAdditionalData',
				action: 'Update additional data of a contact',
			},
		],
		default: 'updateAdditionalData',
	},
];
