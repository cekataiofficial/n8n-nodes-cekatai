import {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
} from 'n8n-workflow';
import { cekatApiRequest } from '../Cekat/GenericFunctions';
import * as options from '../Cekat/methods';

export class CekatAiToolTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cekat Ai Tool Trigger',
		name: 'cekatAiToolTrigger',
		group: ['trigger'],
		version: 1,
		description: 'Trigger node for receiving Cekat AI Tool webhooks',
		icon: 'file:cekat.svg',
		defaults: {
			name: 'Cekat Ai Tool Trigger',
		},
		inputs: [],
		outputs: ['main' as any],
		credentials: [
			{
				name: 'CekatOpenApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
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
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: ITriggerFunctions): Promise<boolean> {
				const workflowName = this.getWorkflow().name;
				const workflowId = this.getWorkflow().id;
				const workflowIsActive = this.getWorkflow().active;

				console.log(`Checking webhook for workflow: ${workflowName} (ID: ${workflowId})`);

				// Sementara return false biar selalu trigger `create()`
				return false;
			},

			async create(this: ITriggerFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');

				const agentId = this.getNodeParameter('agentId') as string;
				const name = this.getNodeParameter('name') as string;
				const description = this.getNodeParameter('description') as string;
				const aiInputs = this.getNodeParameter('aiInputs') as any[];

				const workflowId = this.getWorkflow().id;
				const workflowName = this.getWorkflow().name;

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
			},

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
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<any> {
		const body = this.getBodyData();
		const workflowName = this.getWorkflow().name;
		const workflowId = this.getWorkflow().id;
		const workflowIsActive = this.getWorkflow().active;
		return {
			workflowData: [
				[{ json: body, additionalFields: { workflowName, workflowId, workflowIsActive } }],
			],
		};
	}

	methods = {
		loadOptions: {
			...options,
			getAIAgentsDropdown: options.getAIAgentsDropdown,
		},
	};
}
