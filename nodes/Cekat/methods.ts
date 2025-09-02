import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { cekatApiRequest } from './GenericFunctions';

// Existing functions...
export async function getInboxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const credentials = await this.getCredentials('CekatOpenApi');
	if (!credentials || !credentials.apiKey) {
		throw new Error('No Cekat API Key credentials found!');
	}
	const apiKey = credentials.apiKey as string;
	const data = await cekatApiRequest.call(
		this,
		'GET',
		'/inboxes',
		{},
		{
			api_key: apiKey,
		},
		'api',
	);

	return data.data.map(
		(inbox: { id: string; name: string; type: string; phone_number: string }) => ({
			name:
				inbox.name +
				(inbox.type
					? ` (${inbox.type}${inbox.phone_number ? ` - ${inbox.phone_number}` : ''})`
					: ''),
			value: inbox.id,
		}),
	);
}

export async function loadTemplateVariables(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const credentials = await this.getCredentials('CekatOpenApi');
	if (!credentials || !credentials.apiKey) {
		throw new Error('No Cekat API Key credentials found!');
	}
	const apiKey = credentials.apiKey as string;

	const inboxId = this.getNodeParameter('inboxId') as string;

	const data = await cekatApiRequest.call(
		this,
		'GET',
		'/templates',
		{ inbox_id: inboxId },
		{ api_key: apiKey },
		'api',
	);

	return data.data.map((template: { id: string; name: string }) => ({
		name: template.name,
		value: template.id,
	}));
}

export async function getTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const credentials = await this.getCredentials('CekatOpenApi');
	if (!credentials || !credentials.apiKey) {
		throw new Error('No Cekat API Key credentials found!');
	}
	const apiKey = credentials.apiKey as string;

	const inboxId = this.getNodeParameter('inboxId') as string;

	const data = await cekatApiRequest.call(
		this,
		'GET',
		'/templates',
		{ inbox_id: inboxId },
		{ api_key: apiKey },
		'api',
	);

	return data.data.map((template: { id: string; name: string }) => ({
		name: template.name,
		value: template.id,
	}));
}

export async function getAgentsDropdown(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const res = await cekatApiRequest.call(
		this,
		'GET',
		'/business_workflows/agents',
		{},
		{},
		'server',
	);

	return res.map((agent: { id: string; name: string }) => ({
		name: agent.name,
		value: agent.id,
	}));
}

export async function getAIAgentsDropdown(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const res = await cekatApiRequest.call(
		this,
		'GET',
		'/business_workflows/ai-agents',
		{},
		{},
		'server',
	);

	return res.map((agent: { id: string; name: string }) => ({
		name: agent.name,
		value: agent.id,
	}));
}

export async function getLabelsDropdown(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const res = await cekatApiRequest.call(
		this,
		'GET',
		'/business_workflows/labels',
		{},
		{},
		'server',
	);

	return res.map((labels: { id: string; name: string }) => ({
		name: labels.name,
		value: labels.id,
	}));
}

export async function getPipelinesDropdown(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const res = await cekatApiRequest.call(
		this,
		'GET',
		'/business_workflows/pipeline-status',
		{},
		{},
		'server',
	);

	return res.map((pipelines: { id: string; name: string; color: string }) => ({
		name: pipelines.name,
		value: pipelines.id,
		color: pipelines.color,
	}));
}

export async function getInboxesDropdown(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const res = await cekatApiRequest.call(
		this,
		'GET',
		'/business_workflows/inboxes',
		{},
		{},
		'server',
	);

	return res.map((inbox: { id: string; name: string }) => ({
		name: inbox.name,
		value: inbox.id,
	}));
}

// CRM BOARDS - Updated dengan pattern existing
export async function getBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const res = await cekatApiRequest.call(
			this,
			'GET',
			'/api/crm/boards',
			{},
			{},
			'staging',
		);

		console.log('getBoards response:', JSON.stringify(res, null, 2));

		if (res.message === 'success' && res.data) {
			if (Array.isArray(res.data)) {
				return res.data.map((board: { id: string; name: string; column_name?: string }) => ({
					name: board.column_name ? `${board.name} (${board.column_name})` : board.name,
					value: board.id,
				}));
			} else {
				const board = res.data;
				return [{
					name: board.column_name ? `${board.name} (${board.column_name})` : board.name,
					value: board.id,
				}];
			}
		}

		if (res.boards && Array.isArray(res.boards)) {
			return res.boards.map((board: { id: string; name: string; column_name?: string }) => ({
				name: board.column_name ? `${board.name} (${board.column_name})` : board.name,
				value: board.id,
			}));
		}

		console.log('No valid board data found in response');
		return [];
	} catch (error) {
		console.error('Error in getBoards:', error);
		return [];
	}
}

// CRM GROUPS - Load groups berdasarkan board
export async function getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const boardId = this.getNodeParameter('boardId', 0, '') as string;
		
		if (!boardId) {
			console.log('getGroups called without boardId');
			return [];
		}
		
		const res = await cekatApiRequest.call(
			this,
			'GET',
			`/api/crm/boards/${boardId}`,
			{},
			{},
			'staging',
		);
		
		console.log('getGroups response for boardId:', boardId);
		
		if (res.message === 'success' && res.data?.crm_groups) {
			return res.data.crm_groups.map((group: { id: string; name: string; color?: string }) => ({
				name: group.name,
				value: group.id,
				description: group.color ? `Color: ${group.color}` : undefined,
			}));
		}
		
		return [];
	} catch (error) {
		console.error('Error in getGroups:', error);
		return [];
	}
}

// CRM ITEMS - Load items berdasarkan board
export async function getItems(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const boardId = this.getNodeParameter('boardId', 0, '') as string;
		
		if (!boardId) {
			console.log('getItems called without boardId');
			return [];
		}
		
		const res = await cekatApiRequest.call(
			this,
			'GET',
			`/api/crm/boards/${boardId}/items`,
			{},
			{},
			'staging',
		);
		
		console.log('getItems response:', JSON.stringify(res, null, 2));
		
		if (res.message === 'success' && Array.isArray(res.data)) {
			return res.data.map((item: any) => ({
				name: item.item_name || item.name || 'Unknown Item',
				value: item.item_id || item.id,
			}));
		}
		
		if (Array.isArray(res)) {
			return res.map((item: any) => ({
				name: item.item_name || item.name || 'Unknown Item',
				value: item.item_id || item.id,
			}));
		}
		
		console.log('No valid items found in response');
		return [];
	} catch (error) {
		console.error('Error in getItems:', error);
		return [];
	}
}

// DYNAMIC BOARD COLUMNS - Fungsi utama untuk dynamic fields
export async function getBoardColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const boardId = this.getNodeParameter('boardId', 0, '') as string;
		
		if (!boardId) {
			console.log('getBoardColumns called without boardId');
			return [];
		}
		
		console.log('Getting columns for boardId:', boardId);
		
		const res = await cekatApiRequest.call(
			this,
			'GET',
			`/api/crm/boards/${boardId}`,
			{},
			{},
			'staging',
		);
		
		console.log('getBoardColumns response:', JSON.stringify(res, null, 2));
		
		if (res.message === 'success' && res.data?.crm_columns) {
			return res.data.crm_columns
	.filter((column: any) => !column.read_only && column.is_visible && column.type !== 'timeline')
	.map((column: { id: string; name: string; type: string; settings?: any; is_required?: boolean }) => {
		let displayName = column.name;

		if (column.type) {
			displayName += ` (${column.type})`;
		}
		if (column.type === 'number' && column.settings?.unit) {
			displayName += ` [${column.settings.unit}]`;
		}
		if (column.is_required) {
			displayName += ' *';
		}

		return {
			name: displayName,       
			value: column.name,    
			description: `Column: ${column.name} | Type: ${column.type}`,
		};
	});

		}
		
		console.log('No valid columns found in response for boardId:', boardId);
		return [];
	} catch (error) {
		console.error('Error in getBoardColumns:', error);
		return [];
	}
}

// Load stage options untuk dropdown Stage (jika ada)
export async function getStageOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const boardId = this.getNodeParameter('boardId', 0, '') as string;
		
		if (!boardId) return [];
		
		const res = await cekatApiRequest.call(
			this,
			'GET',
			`/api/crm/boards/${boardId}`,
			{},
			{},
			'staging',
		);
		
		if (res.message === 'success' && res.data?.crm_columns) {
			const stageColumn = res.data.crm_columns.find((col: any) => 
				col.name.toLowerCase().includes('stage') && col.type === 'select'
			);

			if (stageColumn?.settings?.labels) {
				return stageColumn.settings.labels
					.filter((label: any) => label.id !== 'default')
					.map((label: any) => ({
						name: label.name,
						value: label.id,
						description: `Stage: ${label.name}`,
					}));
			}
		}

		return [];
	} catch (error) {
		console.error('Error loading stage options:', error);
		return [];
	}
}


