import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { cekatApiRequest } from './GenericFunctions';

export async function getInboxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	// Retrieve the credentials object declared on the node
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

	// Dapetin inboxId yang user pilih di UI node n8n
	const inboxId = this.getNodeParameter('inboxId') as string;

	// Panggil API pakai inboxId
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

	// Dapetin inboxId yang user pilih di UI node n8n
	const inboxId = this.getNodeParameter('inboxId') as string;

	// Panggil API pakai inboxId
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

export async function getBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const res = await cekatApiRequest.call(
		this,
		'GET',
		'/api/crm/boards',
		{},
		{},
		'staging',
	);

	// Handle response structure berdasarkan API response yang diberikan
	if (res.message === 'success' && res.data) {
		// Jika response adalah single board object
		if (Array.isArray(res.data)) {
			return res.data.map((board: { id: string; name: string; column_name?: string }) => ({
				name: board.column_name ? `${board.name} (${board.column_name})` : board.name,
				value: board.id,
			}));
		} else {
			// Jika response adalah single board
			const board = res.data;
			return [{
				name: board.column_name ? `${board.name} (${board.column_name})` : board.name,
				value: board.id,
			}];
		}
	}

	// Fallback untuk response structure yang berbeda
	if (res.boards && Array.isArray(res.boards)) {
		return res.boards.map((board: { id: string; name: string; column_name?: string }) => ({
			name: board.column_name ? `${board.name} (${board.column_name})` : board.name,
			value: board.id,
		}));
	}

	// Jika tidak ada data yang valid, return empty array
	return [];
}


export async function getAllBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const res = await cekatApiRequest.call(
		this,
		'GET',
		'/api/crm/boards',
		{},
		{},
		'staging',
	);

	// Handle response structure untuk list boards
	if (res.message === 'success' && Array.isArray(res.data)) {
		return res.data.map((board: { id: string; name: string; column_name?: string }) => ({
			name: board.column_name ? `${board.name} (${board.column_name})` : board.name,
			value: board.id,
		}));
	}

	// Fallback
	if (res.boards && Array.isArray(res.boards)) {
		return res.boards.map((board: { id: string; name: string; column_name?: string }) => ({
			name: board.column_name ? `${board.name} (${board.column_name})` : board.name,
			value: board.id,
		}));
	}

	return [];
}


// loader untuk dropdown
export async function getItems(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
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
	
	
	// ✅ Handle response structure berdasarkan contoh yang Anda berikan
	if (res.message === 'success' && Array.isArray(res.data)) {
		return res.data.map((item: any) => ({
			name: item.item_name || 'Unknown Item',
			value: item.item_id,
		}));
	}
	
	// ✅ Fallback jika response langsung array
	if (Array.isArray(res)) {
		return res.map((item: any) => ({
			name: item.item_name || item.name || 'Unknown Item',
			value: item.item_id || item.id,
		}));
	}
	
	console.log('Unexpected response structure:', res);
	return [];
}

