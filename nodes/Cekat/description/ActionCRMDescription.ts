import type { INodeProperties } from 'n8n-workflow';
// Utility function to format column values based on column type
export function formatColumnValue(columnName: string, valueType: string, params: any): any {
	switch (valueType) {
		case 'timeline':
			return {
				[columnName]: {
					from: params.timelineFrom || '',
					to: params.timelineTo || ''
				}
			};

		case 'files':
			const files = params.files?.file || [];
			return {
				[columnName]: files.map((file: any) => ({
					file_name: file.fileName || '',
					file_url: file.fileUrl || '',
					file_type: file.fileType || ''
				}))
			};

		case 'agents':
			return {
				[columnName]: params.agentIds || []
			};

		case 'contacts':
			return {
				[columnName]: params.contactIds || []
			};

		case 'companies':
			return {
				[columnName]: params.companyIds || []
			};

		case 'orders':
			return {
				[columnName]: params.orderIds || []
			};

		case 'subscriptions':
			return {
				[columnName]: params.subscriptionIds || []
			};

		case 'references':
			const ids = params.referenceIds ? params.referenceIds.split(',').map((id: string) => id.trim()) : [];
			return {
				[columnName]: ids
			};

		case 'dropdown':
			const values = params.dropdownValues ? params.dropdownValues.split(',').map((val: string) => val.trim()) : [];
			return {
				[columnName]: values
			};

		case 'number':
			return {
				[columnName]: Number(params.numberValue) || 0
			};

	
			case 'date':
				if (!params.dateValue) return { [columnName]: '' };
			
				const date = new Date(params.dateValue);
				const offset = -date.getTimezoneOffset(); // dibalik tanda, supaya + untuk timur
				const sign = offset >= 0 ? '+' : '-';
				const absOffset = Math.abs(offset);
				const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
				const minutes = String(absOffset % 60).padStart(2, '0');
			
				const isoWithTZ = date.toISOString().replace('Z', `${sign}${hours}:${minutes}`);
				return { [columnName]: isoWithTZ };
			


		case 'checkbox':
			return {
				[columnName]: Boolean(params.checkboxValue)
			};

		case 'email':
			return {
				[columnName]: params.emailValue || ''
			};

		case 'phone':
			return {
				[columnName]: params.phoneValue || ''
			};

		case 'longtext':
			return {
				[columnName]: params.longTextValue || ''
			};

		case 'select':
			return {
				[columnName]: params.selectValue || ''
			};

		case 'conversation':
			return {
				[columnName]: params.conversationValue || ''
			};

		case 'text':
		default:
			return {
				[columnName]: params.textValue || params.stringValue || ''
			};
	}
}

// Function to process multiple columns for create operation
export function processCreateItemColumns(columns: any[]): Record<string, any> {
	const processedColumns: Record<string, any> = {};
	
	columns.forEach((col) => {
		if (col.column?.columnName && col.column?.valueType) {
			const formatted = formatColumnValue(
				col.column.columnName,
				col.column.valueType,
				col.column
			);
			Object.assign(processedColumns, formatted);
		}
	});
	
	return processedColumns;
}

// Function to process multiple columns for update operation
export function processUpdateItemColumns(columns: any[]): Record<string, any> {
	const processedColumns: Record<string, any> = {};
	
	columns.forEach((col) => {
		if (col.column?.columnName && col.column?.valueType) {
			const formatted = formatColumnValue(
				col.column.columnName,
				col.column.valueType,
				col.column
			);
			Object.assign(processedColumns, formatted);
		}
	});
	
	return processedColumns;
}

// Function to process single column for update operation (kept for backward compatibility)
export function processUpdateItemColumn(columnName: string, valueType: string, params: any): Record<string, any> {
	return formatColumnValue(columnName, valueType, params);
}

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
						displayName: 'Value Type',
						name: 'valueType',
						type: 'options',
						options: [
							{
								name: 'Agents',
								value: 'agents',
								description: 'For selecting one or more agents',
							},
							{
								name: 'Date',
								value: 'date',
								description: 'For date picker columns',
							},
							{
								name: 'Text/String',
								value: 'string',
								description: 'For text, email, phone, url, link, location, date, datetime, status, priority columns',
							},
							{
								name: 'Number',
								value: 'number',
								description: 'For numeric columns',
							},
							{
								name: 'Dropdown (Multiple Options)',
								value: 'dropdown',
								description: 'For dropdown/multi-select columns',
							},
							{
								name: 'Timeline (Date Range)',
								value: 'timeline',
								description: 'For timeline columns with from/to dates',
							},
							{
								name: 'Files',
								value: 'files',
								description: 'For file attachment columns',
							},
							{
								name: 'References (UUIDs)',
								value: 'references',
								description: 'For agents, contacts, companies, subscriptions, orders, references columns',
							},
						],
						default: 'string',
						description: 'Select the type of value you want to provide',
					},
					{
						displayName: 'Select Agents',
						name: 'agentIds',
						type: 'multiOptions',
						typeOptions: {
							loadOptionsMethod: 'getAgentsDropdown',
						},
						default: [],
						description: 'Select one or more agents',
						displayOptions: {
							show: {
								valueType: ['agents'],
							},
						},
					},
					// Date picker
					{
						displayName: 'Select Date',
						name: 'dateValue',
						type: 'dateTime',
						default: '',
						description: 'Pick a date',
						displayOptions: {
							show: {
								valueType: ['date'],
							},
						},
					},
					// String value
					{
						displayName: 'Text Value',
						name: 'stringValue',
						type: 'string',
						default: '',
						description: 'Value for text-based columns',
						displayOptions: {
							show: {
								valueType: ['string'],
							},
						},
					},
					// Number value
					{
						displayName: 'Number Value',
						name: 'numberValue',
						type: 'number',
						default: 0,
						description: 'Numeric value',
						displayOptions: {
							show: {
								valueType: ['number'],
							},
						},
					},
					// Dropdown values
					{
						displayName: 'Dropdown Options',
						name: 'dropdownValues',
						type: 'string',
						default: '',
						description: 'Comma-separated values (e.g., "Option1,Option2,Option3")',
						displayOptions: {
							show: {
								valueType: ['dropdown'],
							},
						},
					},
					// Timeline from
					{
						displayName: 'Timeline From Date',
						name: 'timelineFrom',
						type: 'string',
						default: '',
						description: 'Start date (ISO format: YYYY-MM-DD)',
						displayOptions: {
							show: {
								valueType: ['timeline'],
							},
						},
					},
					// Timeline to
					{
						displayName: 'Timeline To Date',
						name: 'timelineTo',
						type: 'string',
						default: '',
						description: 'End date (ISO format: YYYY-MM-DD)',
						displayOptions: {
							show: {
								valueType: ['timeline'],
							},
						},
					},
					// Files collection
					{
						displayName: 'Files',
						name: 'files',
						placeholder: 'Add File',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: 'Files to attach',
						displayOptions: {
							show: {
								valueType: ['files'],
							},
						},
						options: [
							{
								displayName: 'File',
								name: 'file',
								values: [
									{
										displayName: 'File Name',
										name: 'fileName',
										type: 'string',
										default: '',
										description: 'Name of the file',
									},
									{
										displayName: 'File URL',
										name: 'fileUrl',
										type: 'string',
										default: '',
										description: 'URL of the file',
									},
									{
										displayName: 'File Type',
										name: 'fileType',
										type: 'string',
										default: '',
										description: 'MIME type (e.g., image/png, application/pdf)',
									},
								],
							},
						],
					},
					// Reference IDs
					{
						displayName: 'Reference UUIDs',
						name: 'referenceIds',
						type: 'string',
						default: '',
						description: 'Comma-separated UUIDs for reference columns',
						displayOptions: {
							show: {
								valueType: ['references'],
							},
						},
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
		displayName: 'Columns to Update',
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
						displayName: 'Column to Update',
						name: 'columnName',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getBoardColumns',
							loadOptionsDependsOn: ['boardId'],
						},
						default: '',
						description: 'Select which column you want to update',
					},
					{
						displayName: 'Value Type',
						name: 'valueType',
						type: 'options',
						options: [
							{
								name: 'Agents',
								value: 'agents',
								description: 'For selecting one or more agents',
							},
							{
								name: 'Date',
								value: 'date',
								description: 'For date picker columns',
							},
							{
								name: 'Text/String',
								value: 'string',
								description: 'For text, email, phone, url, link, location, date, datetime, status, priority columns',
							},
							{
								name: 'Number',
								value: 'number',
								description: 'For numeric columns',
							},
							{
								name: 'Dropdown (Multiple Options)',
								value: 'dropdown',
								description: 'For dropdown/multi-select columns',
							},
							{
								name: 'Timeline (Date Range)',
								value: 'timeline',
								description: 'For timeline columns with from/to dates',
							},
							{
								name: 'Files',
								value: 'files',
								description: 'For file attachment columns',
							},
							{
								name: 'References (UUIDs)',
								value: 'references',
								description: 'For agents, contacts, companies, subscriptions, orders, references columns',
							},
						],
						default: 'string',
						description: 'Select the type of value you want to provide',
					},
					{
						displayName: 'Select Agents',
						name: 'agentIds',
						type: 'multiOptions',
						typeOptions: {
							loadOptionsMethod: 'getAgentsDropdown',
						},
						default: [],
						description: 'Select one or more agents',
						displayOptions: {
							show: {
								valueType: ['agents'],
							},
						},
					},
					// Date picker
					{
						displayName: 'Select Date',
						name: 'dateValue',
						type: 'dateTime',
						default: '',
						description: 'Pick a date',
						displayOptions: {
							show: {
								valueType: ['date'],
							},
						},
					},
					// String value
					{
						displayName: 'New Text Value',
						name: 'stringValue',
						type: 'string',
						default: '',
						description: 'New value for text-based columns',
						displayOptions: {
							show: {
								valueType: ['string'],
							},
						},
					},
					// Number value
					{
						displayName: 'New Number Value',
						name: 'numberValue',
						type: 'number',
						default: 0,
						description: 'New numeric value',
						displayOptions: {
							show: {
								valueType: ['number'],
							},
						},
					},
					// Dropdown values
					{
						displayName: 'New Dropdown Options',
						name: 'dropdownValues',
						type: 'string',
						default: '',
						description: 'Comma-separated values (e.g., "Option1,Option2,Option3")',
						displayOptions: {
							show: {
								valueType: ['dropdown'],
							},
						},
					},
					// Timeline from
					{
						displayName: 'Timeline From Date',
						name: 'timelineFrom',
						type: 'string',
						default: '',
						description: 'Start date (ISO format: YYYY-MM-DD)',
						displayOptions: {
							show: {
								valueType: ['timeline'],
							},
						},
					},
					// Timeline to
					{
						displayName: 'Timeline To Date',
						name: 'timelineTo',
						type: 'string',
						default: '',
						description: 'End date (ISO format: YYYY-MM-DD)',
						displayOptions: {
							show: {
								valueType: ['timeline'],
							},
						},
					},
					// Files collection
					{
						displayName: 'Files',
						name: 'files',
						placeholder: 'Add File',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: 'Files to attach',
						displayOptions: {
							show: {
								valueType: ['files'],
							},
						},
						options: [
							{
								displayName: 'File',
								name: 'file',
								values: [
									{
										displayName: 'File Name',
										name: 'fileName',
										type: 'string',
										default: '',
										description: 'Name of the file',
									},
									{
										displayName: 'File URL',
										name: 'fileUrl',
										type: 'string',
										default: '',
										description: 'URL of the file',
									},
									{
										displayName: 'File Type',
										name: 'fileType',
										type: 'string',
										default: '',
										description: 'MIME type (e.g., image/png, application/pdf)',
									},
								],
							},
						],
					},
					// Reference IDs
					{
						displayName: 'Reference UUIDs',
						name: 'referenceIds',
						type: 'string',
						default: '',
						description: 'Comma-separated UUIDs for reference columns',
						displayOptions: {
							show: {
								valueType: ['references'],
							},
						},
					},
				],
			},
		],
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
	},	
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