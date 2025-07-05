import { IHttpRequestOptions, IExecuteFunctions, ITriggerFunctions } from 'n8n-workflow';

const server_url = process.env.CEKAT_SERVER_URL;

export async function cekatApiRequest(
	this: IExecuteFunctions | ITriggerFunctions,
	method: string,
	endpoint: string,
	body: any = {},
	qs: any = {},
): Promise<any> {
	const credentials = await this.getCredentials('CekatOpenApi');

	const options: IHttpRequestOptions = {
		method,
		url: `${(server_url || 'http://localhost:3001') + endpoint}`,
		headers: {
			Authorization: `Bearer ${credentials.apiKey}`,
		},
		qs,
		body,
		json: true,
	};

	return this.helpers.httpRequest(options);
}
