import type { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,

		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		options: [
			{
				name: 'Send Message',
				value: 'sendMessage',
				action: 'Send a message',
			},
			{
				name: 'Send Template Message',
				value: 'sendTemplateMessage',
				action: 'Send a template message',
			},
		],
		default: 'sendMessage',
	},
];

export const messageFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                             message: sendMessage                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Convertsation ID',
		name: 'conversationId',
		type: 'string',
		default: '',
		required: true,
		description: 'Please fill in the conversation ID to send the message to',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
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
				operation: ['sendMessage'],
			},
		},
	},
	{
		displayName: 'Message Text',
		name: 'text',
		type: 'string',
		default: '',
		required: true,
		description: 'The content of the text message',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
		},
	},
	// {
	// 	displayName: 'File URL',
	// 	name: 'text',
	// 	type: 'string',
	// 	default: '',
	// 	description: 'The URL of the file to send',
	// 	placeholder: 'https://example.com/file.jpg',
	// 	typeOptions: {
	// 		multipleValues: true,
	// 	},
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['message'],
	// 			operation: ['sendMessage'],
	// 		},
	// 	},
	// },

	/* -------------------------------------------------------------------------- */
	/*                        message: sendTemplateMessage                       */
	/* -------------------------------------------------------------------------- */
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
	},
	{
		displayName: 'Body Variables',
		name: 'bodyVariables',
		placeholder: 'Add Variable',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: [],
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
