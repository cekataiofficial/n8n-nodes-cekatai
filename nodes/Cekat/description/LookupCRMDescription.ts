import type { INodeProperties } from 'n8n-workflow';

export const lookupCRMOperation: INodeProperties[] = [
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
				name: 'Get All Boards',
				value: 'getAllBoards',
				action: 'Get all boards',
			},
			{
				name: 'Get Board',
				value: 'getBoard',
				action: 'Get board',
			},
			{
				name: 'Get All Items',
				value: 'getAllItems',
				action: 'Get all items',
			},
			{
				name: 'Get Item',
				value: 'getItem',
				action: 'Get item',
			},
		],
		default: 'getAllBoards',
	},
];

export const lookupCRMFields: INodeProperties[] = [
	// ========== GET BOARD FIELDS ==========
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
				resource: ['lookup'],
				operation: ['getBoard', 'getAllItems', 'getItem'],
			},
		},
	},

	// ========== GET ITEM FIELDS ==========
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
				resource: ['lookup'],
				operation: ['getItem'],
			},
		},
	},
];
