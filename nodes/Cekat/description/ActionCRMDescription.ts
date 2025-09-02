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
		displayName: 'Group',
		name: 'groupId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGroups',
			loadOptionsDependsOn: ['boardId'],
		},
		default: '',
		description: 'Group/Category where the item will be placed (optional)',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['createItem'],
			},
		},
	},
	{
		displayName: 'Item Name',
		name: 'itemName',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the item (required by API)',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['createItem'],
			},
		},
	},
	{
		displayName: 'Columns to Fill',
		name: 'columns',
		placeholder: 'Add Column',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		options: [
			{
				displayName: 'Column',
				name: 'column',
				values: [
					{
						displayName: 'Column to Fill',
						name: 'columnName',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getBoardColumns',
							loadOptionsDependsOn: ['boardId'],
						},
						default: '',
						description: 'Select which column you want to fill',
					},
					{
						displayName: 'Column Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value for the selected column (format depends on column type)',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['createItem'],
			},
		},
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
		displayName: 'Column to Update',
		name: 'columnToUpdate',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getBoardColumns',
			loadOptionsDependsOn: ['boardId'],
		},
		default: '',
		description: 'Select which column you want to update',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['updateItem'],
			},
		},
	},
	{
		displayName: 'New Value',
		name: 'newValue',
		type: 'string',
		default: '',
		description: 'New value for the selected column (format depends on column type)',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['updateItem'],
			},
		},
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
		displayName: 'Item Names or IDs',
		name: 'itemIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getItems',
			loadOptionsDependsOn: ['boardId'],
		},
		default: [],
		required: true,
		description: 'Select one or more items to delete',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['deleteItems'],
			},
		},
	}
,	
	{
		displayName: 'Confirm Deletion',
		name: 'confirmDelete',
		type: 'boolean',
		default: false,
		required: true,
		description: 'You must confirm that you want to delete these items',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['deleteItems'],
			},
		},
	},
];