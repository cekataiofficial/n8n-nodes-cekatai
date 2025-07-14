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
	{
		displayName: 'Conversation ID',
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
		typeOptions: {
			rows: 4,
		},
		required: true,
		description: 'The content of the text message',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
		},
	},
	{
		displayName: '📌 Note: File URL must end with a file name (e.g. `.jpg`, `.png`, `.pdf`, etc.)',
		name: 'fileUrlNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
			hide: {
				isInteractive: [true],
			},
		},
	},
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		placeholder: 'https://example.com/file.jpg',
		description: 'The URL of the file to send. The URL must include a file name at the end.',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
			hide: {
				isInteractive: [true],
			},
		},
	},
	{
		displayName: 'Interactive Message',
		name: 'isInteractive',
		type: 'boolean',
		default: false,
		description: 'Enable this to send an interactive message (CTA, Button, List)',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
		},
	},
	{
		displayName: 'Media Type',
		name: 'mediaType',
		type: 'options',
		options: [
			{
				name: 'Call To Action',
				value: 'cta_url',
				description: 'Send a message with a call to action button (URL-based)',
			},
			{
				name: 'Button',
				value: 'button',
				description: 'Send a message with quick reply buttons (max 3)',
			},
			{
				name: 'List',
				value: 'list',
				description: 'Send a message with a list of grouped options',
			},
		],
		default: 'cta_url',
		typeOptions: {
			rows: 4,
		},
		description: 'Choose the type of interactive message to send',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				isInteractive: [true],
			},
		},
	},
	{
		displayName: 'CTA Button',
		name: 'ctaButton',
		type: 'collection',
		placeholder: 'Add CTA button details',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				isInteractive: [true],
				mediaType: ['cta_url'],
			},
		},
		options: [
			{
				displayName: 'Button Label',
				name: 'display_text',
				type: 'string',
				default: 'Kunjungi Website',
			},
			{
				displayName: 'Button URL',
				name: 'url',
				type: 'string',
				default: 'https://tokokamu.com',
			},
		],
	},

	{
		displayName: '🔘 Quick Reply Buttons',
		name: 'buttons',
		type: 'fixedCollection',
		default: [],
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				isInteractive: [true],
				mediaType: ['button'],
			},
		},
		options: [
			{
				name: 'button',
				displayName: 'Button',
				values: [
					{
						displayName: 'Button ID',
						name: 'id',
						type: 'string',
						default: 'beli_sekarang',
					},
					{
						displayName: 'Button Label',
						name: 'title',
						type: 'string',
						default: 'Beli Sekarang',
					},
				],
			},
		],
		description: 'Add up to 3 reply buttons',
	},
	{
		displayName: '📋 List - Button Text',
		name: 'buttonText',
		type: 'string',
		default: 'Lihat Paket',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				isInteractive: [true],
				mediaType: ['list'],
			},
		},
		description: 'Text shown on the list trigger button',
	},
	{
		displayName: '📋 List - Sections',
		name: 'sections',
		type: 'fixedCollection',
		default: [],
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				isInteractive: [true],
				mediaType: ['list'],
			},
		},
		options: [
			{
				name: 'section',
				displayName: 'Section',
				values: [
					{
						displayName: 'Section Title',
						name: 'title',
						type: 'string',
						default: 'Paket Pilihan',
					},
					{
						displayName: 'Rows',
						name: 'rows',
						type: 'fixedCollection',
						default: [],
						typeOptions: {
							multipleValues: true,
						},
						options: [
							{
								name: 'row',
								displayName: 'Row',
								values: [
									{
										displayName: 'Row ID',
										name: 'id',
										type: 'string',
										default: 'paket_basic',
									},
									{
										displayName: 'Row Title',
										name: 'title',
										type: 'string',
										default: 'Paket Basic',
									},
									{
										displayName: 'Row Description',
										name: 'description',
										type: 'string',
										default: 'Cocok untuk pemula',
									},
								],
							},
						],
					},
				],
			},
		],
		description: 'Group your list options into sections',
	},

	{
		displayName: 'Header',
		name: 'headerWithFileUrl',
		type: 'collection',
		placeholder: 'Add Header Details',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				isInteractive: [true],
				mediaType: ['cta_url', 'button'],
			},
		},
		options: [
			{
				displayName: 'Header Text',
				name: 'header_text',
				type: 'string',
				default: 'Header Text',
				description: 'Text to display in the header of the message',
			},
			{
				displayName: 'Header File URL',
				name: 'header_file_url',
				type: 'string',
				default: 'https://tokokamu.com',
				description: 'Optional file URL for header (image, document, etc)',
			},
		],
	},
	{
		displayName: 'Header',
		name: 'headerWithoutFileUrl',
		type: 'collection',
		placeholder: 'Add Header Details',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				isInteractive: [true],
				mediaType: ['list'],
			},
		},
		options: [
			{
				displayName: 'Header Text',
				name: 'header_text',
				type: 'string',
				default: 'Header Text',
				description: 'Text to display in the header of the message',
			},
		],
	},

	{
		displayName: 'Footer',
		name: 'footer',
		type: 'collection',
		placeholder: 'Add Footer Details',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				isInteractive: [true],
				mediaType: ['cta_url', 'button', 'list'],
			},
		},
		options: [
			{
				displayName: 'Footer Text',
				name: 'footer_text',
				type: 'string',
				default: 'Footer Text',
				description: 'Text to display in the Footer of the message',
			},
		],
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
