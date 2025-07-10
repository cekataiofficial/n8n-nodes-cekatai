import {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	IDataObject,
	INodeExecutionData,
	BINARY_ENCODING,
} from 'n8n-workflow';
import { cekatApiRequest } from '../Cekat/GenericFunctions';
import * as options from '../Cekat/methods';
import {
	defaultWebhookDescription,
	responseCodeProperty,
	responseDataProperty,
	responseModeProperty,
	responseModePropertyStreaming,
} from './description/ResponseOptions';
import {
	checkResponseModeConfiguration,
	configuredOutputs,
	setupOutputConnection,
} from './description/utils';
const responseModeOptions = [
	{
		name: 'Immediately',
		value: 'onReceived',
		description: 'As soon as this node executes',
	},
	{
		name: 'When Last Node Finishes',
		value: 'lastNode',
		description: 'Returns data of the last-executed node',
	},
	{
		name: "Using 'Respond to Webhook' Node",
		value: 'responseNode',
		description: 'Response defined in that node',
	},
];
export class CekatAiToolTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cekat Ai Tool Trigger',
		name: 'cekatAiToolTrigger',
		group: ['trigger'],
		version: [1, 1.1, 2, 2.1],
		// Keep the default version as 2 to avoid releasing streaming in broken state
		defaultVersion: 2,
		description: 'Trigger node for receiving Cekat AI Tool webhooks',
		icon: 'file:cekat.svg',
		defaults: {
			name: 'Cekat Ai Tool Trigger',
		},
		inputs: [],
		outputs: `={{(${configuredOutputs})($parameter)}}`,
		credentials: [
			{
				name: 'CekatOpenApi',
				required: true,
			},
		],
		webhooks: [defaultWebhookDescription],

		properties: [
			{
				displayName: 'Choose AI Agent',
				name: 'agentId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAIAgentsDropdown',
				},
				required: true,
				default: '',
				description: 'Select the AI agent to trigger the webhook for',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'The name of the AI tool',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: false,
				default: '',
				description: 'The description of the AI tool',
			},
			{
				displayName: 'AI Inputs',
				name: 'aiInputs',
				type: 'fixedCollection',
				placeholder: 'Add Input Field',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				options: [
					{
						name: 'input',
						displayName: 'Input',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name of the input field',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'Description of the input field',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Text', value: 'text' },
									{ name: 'Boolean', value: 'boolean' },
									{ name: 'Number', value: 'number' },
								],
								default: 'text',
							},
							{
								displayName: 'Required',
								name: 'required',
								type: 'boolean',
								default: false,
							},
							{
								displayName: 'Enum',
								name: 'enum',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: true,
								},
								default: [],
								placeholder: 'Add Enum Values',
								options: [
									{
										name: 'values',
										displayName: 'Values',
										values: [
											{
												displayName: 'Value',
												name: 'value',
												type: 'string',
												default: '',
												placeholder: 'e.g. my.enum.value',
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				displayName: 'Response Code',
				name: 'responseCode',
				type: 'number',
				displayOptions: {
					hide: {
						responseMode: ['responseNode'],
					},
				},
				typeOptions: {
					minValue: 100,
					maxValue: 599,
				},
				default: 200,
				description: 'The HTTP Response code to return',
			},
			responseModeProperty,
			responseModePropertyStreaming,
			{
				displayName:
					'Insert a \'Respond to Webhook\' node to control when and how you respond. <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/" target="_blank">More details</a>',
				name: 'webhookNotice',
				type: 'notice',
				displayOptions: {
					show: {
						responseMode: ['responseNode'],
					},
				},
				default: '',
			},
			{
				displayName:
					'Insert a node that supports streaming (e.g. \'AI Agent\') and enable streaming to stream directly to the response while the workflow is executed. <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/" target="_blank">More details</a>',
				name: 'webhookStreamingNotice',
				type: 'notice',
				displayOptions: {
					show: {
						responseMode: ['streaming'],
					},
				},
				default: '',
			},
			responseDataProperty,
		],
	};

	async checkExists(this: ITriggerFunctions): Promise<boolean> {
		const workflowName = this.getWorkflow().name;
		const workflowId = this.getWorkflow().id;
		const workflowIsActive = this.getWorkflow().active;
		console.log(`Checking webhook for workflow: ${workflowName} (ID: ${workflowId})`);

		// Sementara return false biar selalu trigger `create()`
		return false;
	}

	async create(this: ITriggerFunctions): Promise<boolean> {
		// const webhookUrl = this.getNodeWebhookUrl('default');

		// const agentId = this.getNodeParameter('agentId') as string;
		// const name = this.getNodeParameter('name') as string;
		// const description = this.getNodeParameter('description') as string;
		// const aiInputs = this.getNodeParameter('aiInputs') as any[];

		// const workflowId = this.getWorkflow().id;
		// const workflowName = this.getWorkflow().name;

		// const expectResponse = this.getNodeParameter('expectResponse') as boolean;

		// if (expectResponse) {
		// 	this.helpers.returnJsonArray([
		// 		{
		// 			json: {
		// 				notice:
		// 					'⚠️ Kamu mengaktifkan "Expect Response" tapi belum menambahkan node Respond to Webhook.',
		// 			},
		// 		},
		// 	]);
		// }

		// await cekatApiRequest.call(
		// 	this,
		// 	'POST',
		// 	'/ai-tools/subscribe',
		// 	{
		// 		webhookUrl,
		// 		workflowId,
		// 		workflowName,
		// 		agentId,
		// 		name,
		// 		description,
		// 		inputs: aiInputs,
		// 	},
		// 	'server',
		// );

		return true;
	}

	async delete(this: ITriggerFunctions): Promise<boolean> {
		const webhookUrl = this.getNodeWebhookUrl('default');
		const workflowId = this.getWorkflow().id;
		const agentId = this.getNodeParameter('agentId') as string;

		// await cekatApiRequest.call(
		// 	this,
		// 	'POST',
		// 	'/ai-tools/unsubscribe',
		// 	{
		// 		webhookUrl,
		// 		workflowId,
		// 		agentId,
		// 	},
		// 	'server',
		// );

		console.log(
			`[AI Tool Trigger] Unsubscribed webhook for workflow ID: ${workflowId}, Agent ID: ${agentId}`,
		);
		return true;
	}
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const workflowName = this.getWorkflow().name;
		const workflowId = this.getWorkflow().id;
		const workflowIsActive = this.getWorkflow().active;

		const { typeVersion: nodeVersion, type: nodeType } = this.getNode();

		if (nodeVersion >= 1 && nodeType === 'CUSTOM.cekatAiToolTrigger') {
			checkResponseModeConfiguration(this);
		}

		const options = this.getNodeParameter('options', {}) as {
			binaryData: boolean;
			ignoreBots: boolean;
			rawBody: boolean;
			responseData?: string;
			ipWhitelist?: string;
		};

		const req = this.getRequestObject();
		const resp = this.getResponseObject();
		const requestMethod = req.method;

		let validationData: IDataObject | undefined;

		const prepareOutput = setupOutputConnection(this, requestMethod, {
			jwtPayload: validationData,
		});

		const response: INodeExecutionData = {
			json: {
				headers: req.headers,
				params: req.params,
				query: req.query,
				body: req.body,
				context: {
					workflowName,
					workflowId,
					workflowIsActive,
				},
			},
		};

		return {
			webhookResponse: options.responseData,
			workflowData: prepareOutput(response),
		};
	}
	methods = {
		loadOptions: {
			...options,
			getAIAgentsDropdown: options.getAIAgentsDropdown,
		},
	};
}
