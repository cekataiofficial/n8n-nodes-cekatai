import type { INodeProperties } from 'n8n-workflow';

export const templateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['template'],
			},
		},
		options: [
			{
				name: 'Get All Templates',
				value: 'getAll',
				action: 'Get all templates',
			},
		],
		default: 'getAll',
	},
];

export const templateFields: INodeProperties[] = [
	{
		displayName: 'Inbox Name',
		name: 'inboxId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getInboxes',
		},
		default: '',
		required: true,
		description: 'Choose an inbox to send the template message from',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplateMessage'],
			},
		},
	},
	{
		displayName: 'Template Name',
		name: 'templateId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTemplates',
			loadOptionsDependsOn: ['inboxId'],
		},
		default: '',
		required: true,
		description: 'Select the template to send',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplateMessage'],
			},
		},
	},
	{
		displayName: 'Receiver Phone Number',
		name: 'receiverPhoneNumber',
		type: 'string',
		default: '',
		required: true,
		description: 'The phone number of the receiver in E.164 format (e.g., +6281234567890)',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplateMessage'],
			},
		},
	},
	{
		displayName: 'Receiver Name',
		name: 'receiverName',
		type: 'string',
		default: '',
		required: true,
		description: 'The name of the receiver to be used in the template',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplateMessage'],
			},
		},
	},
	{
		displayName: 'Body Variables',
		name: 'bodyVariables',
		placeholder: 'Add Variable',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: [],
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplateMessage'],
			},
		},
		options: [
			{
				displayName: 'Variable',
				name: 'variable',
				values: [
					{
						displayName: 'Variable Value (e.g., Name)',
						name: 'value',
						type: 'string',
						default: '',
						description:
							'Value of this variable. Order matters: first variable is {{1}} in your template.',
					},
				],
			},
		],
		description:
			'Add template body variables. Order is important: Variable 1 -> {{1}}, Variable 2 -> {{2}}, etc.',
	},
];
