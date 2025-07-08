import {
	IHttpRequestOptions,
	IExecuteFunctions,
	ITriggerFunctions,
	IRequestOptions,
} from 'n8n-workflow';

const server_url = 'https://api.cekat.ai'; // Default server URL, can be overridden by credentials

export async function cekatApiRequest(
	this: IExecuteFunctions,
	method: string,
	endpoint: string,
	body?: any,
	qs?: any,
): Promise<any> {
	const credentials = await this.getCredentials('CekatOpenApi');
	const options = {
		method,
		body,
		qs,
		headers: {
			api_key: credentials.apiKey,
		},
		uri: `${server_url}${endpoint}`,
		json: true,
	} as IRequestOptions;
	return this.helpers.request(options);
}
