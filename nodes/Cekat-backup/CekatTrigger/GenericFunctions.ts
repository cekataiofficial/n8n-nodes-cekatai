import { IHttpRequestOptions, IExecuteFunctions, ITriggerFunctions } from 'n8n-workflow';

const server_url = 'https://api.cekat.ai'; // Default server URL, can be overridden by environment variable

export async function cekatApiRequest(
	this: IExecuteFunctions | ITriggerFunctions,
	method: string,
	endpoint: string,
	body: any = {},
	qs: any = {},
	headers: any = {}, // tambahkan ini!
): Promise<any> {
	const credentials = await this.getCredentials('CekatOpenApi');

	const options: IHttpRequestOptions = {
		method,
		url: `${server_url + endpoint}`,
		headers: {
			api_key: credentials.apiKey,
		},
		qs,
		body,
		json: true,
	};

	return this.helpers.httpRequest(options);
}
