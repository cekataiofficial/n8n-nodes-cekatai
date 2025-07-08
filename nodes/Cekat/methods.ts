import { IExecuteFunctions, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
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
