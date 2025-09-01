import type { INodeProperties } from 'n8n-workflow';

export const actionCRMOperation: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['action'],
			},
		},
		options: [
			{
				name: 'Create Item',
				value: 'createItem',
				action: 'Create item',
			},
			{
				name: 'Update Item',
				value: 'updateItem',
				action: 'Update item',
			},
			{
				name: 'Delete Items',
				value: 'deleteItems',
				action: 'Delete items',
			},
		],
		default: 'createItem',
	},
];

export const actionCRMFields: INodeProperties[] = [
	// ========== CREATE ITEM FIELDS ==========
	{
		displayName: 'Board Name or ID',
		name: 'boardId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getBoards',
		},
		default: '',
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['createItem'],
			},
		},
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		default: '',
		description: 'Group/Category ID where the item will be placed (optional)',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['createItem'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['createItem'],
			},
		},
		options: [
			{
				displayName: 'Close Probability',
				name: 'closeProbability',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				default: 50,
				description: 'Close probability percentage (0-100)',
			},
			{
				displayName: 'Deal Value',
				name: 'dealValue',
				type: 'number',
				default: 0,
				description: 'Deal value amount',
			},
			{
				displayName: 'Deal Value Currency',
				name: 'dealValueCurrency',
				type: 'options',
				options: [
					{ name: 'USD ($)', value: '$' },
					{ name: 'EUR (€)', value: '€' },
					{ name: 'IDR (Rp)', value: 'Rp' },
					{ name: 'GBP (£)', value: '£' },
				],
				default: '$',
				description: 'Currency for deal value',
			},
			{
				displayName: 'Expected Close Date',
				name: 'expectedCloseDate',
				type: 'dateTime',
				default: '',
				description: 'Expected close date for the deal',
			},
			{
				displayName: 'Forecast Value',
				name: 'forecastValue',
				type: 'number',
				default: 0,
				description: 'Forecast value amount',
			},
			{
				displayName: 'Last Interaction',
				name: 'lastInteraction',
				type: 'dateTime',
				default: '',
				description: 'Date of last interaction',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'string',
				default: '0',
				description: 'Stage ID (0=New, 1=Discovery, 2=Proposal, etc.)',
			},
		],
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		placeholder: 'Add Custom Field',
		default: { field: [] },
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['createItem'],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the custom field',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the custom field',
					},
					{
						displayName: 'Field Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Text', value: 'text' },
							{ name: 'Number', value: 'number' },
							{ name: 'Date', value: 'date' },
							{ name: 'Boolean', value: 'boolean' },
						],
						default: 'text',
						description: 'Type of the custom field',
					},
				],
			},
		],
	},

	// ========== UPDATE ITEM FIELDS ==========
	{
		displayName: 'Board Name or ID',
		name: 'boardId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getBoards',
		},
		default: '',
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['updateItem'],
			},
		},
	},
	{
		displayName: 'Item Name or ID',
		name: 'itemId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getItems',
			loadOptionsDependsOn: ['boardId'],
		},
		default: '',
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['updateItem'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field to Update',
		default: {},
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['updateItem'],
			},
		},
		options: [
			{
				displayName: 'Close Probability',
				name: 'closeProbability',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				default: 50,
				description: 'New close probability percentage (0-100)',
			},
			{
				displayName: 'Deal Value',
				name: 'dealValue',
				type: 'number',
				default: 0,
				description: 'New deal value amount',
			},
			{
				displayName: 'Expected Close Date',
				name: 'expectedCloseDate',
				type: 'dateTime',
				default: '',
				description: 'New expected close date',
			},
			{
				displayName: 'Forecast Value',
				name: 'forecastValue',
				type: 'number',
				default: 0,
				description: 'New forecast value amount',
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				description: 'New group/category ID',
			},

			{
				displayName: 'Stage',
				name: 'stage',
				type: 'string',
				default: '',
				description: 'New stage ID',
			},
		],
	},

	// ========== DELETE ITEMS FIELDS ==========
	{
		displayName: 'Board Name or ID',
		name: 'boardId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getBoards',
		},
		default: '',
		required: true,
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['deleteItems'],
			},
		},
	},
	{
		displayName: 'Item IDs',
		name: 'itemIds',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of item IDs to delete (e.g., id1,id2,id3)',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['deleteItems'],
			},
		},
	},
	{
		displayName: 'Confirm Deletion',
		name: 'confirmDelete',
		type: 'boolean',
		default: false,
		required: true,
		description: 'Whether you must confirm that you want to delete these items',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['deleteItems'],
			},
		},
	},
];