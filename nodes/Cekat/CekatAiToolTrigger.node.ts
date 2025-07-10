import {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import * as options from '../Cekat/methods';
import {
	defaultWebhookDescription,
	responseDataProperty,
	responseModeProperty,
	responseModePropertyStreaming,
} from './description/ResponseOptions';
import { checkResponseModeConfiguration, configuredOutputs } from './description/utils';
import { cekatApiRequest } from './GenericFunctions';

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
				displayName: 'Choose AI Agents',
				name: 'agentIds',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getAIAgentsDropdown',
				},
				required: true,
				default: [],
				description: 'Select one or more AI agents to trigger the webhook for',
			},
			{
				displayName: 'Tool Name',
				name: 'toolName',
				type: 'string',
				required: true,
				default: '',
				description: 'The name of the AI tool',
			},
			{
				displayName: 'Tool Description',
				name: 'toolDescription',
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
			responseDataProperty,
		],
	};

	async checkExists(this: ITriggerFunctions): Promise<boolean> {
		const workflowName = this.getWorkflow().name;
		const workflowId = this.getWorkflow().id;
		const workflowIsActive = this.getWorkflow().active;
		console.log(`Checking webhook for workflow: ${workflowName} (ID: ${workflowId})`);

		// Sementara return false biar selalu trigger `create()`
		return true;
	}

	async create(this: ITriggerFunctions): Promise<boolean> {
		const agentIds = this.getNodeParameter('agentIds') as string[];
		const name = this.getNodeParameter('name') as string;
		const description = this.getNodeParameter('description') as string;
		const aiInputsRaw = this.getNodeParameter('aiInputs', []) as any[];
		const webhookUrl = this.getNodeWebhookUrl('default');
		const workflowId = this.getWorkflow().id;

		console.log(`Creating webhook for workflow ID: ${workflowId}, Agents: ${agentIds.join(', ')}`);
		// Format ulang aiInputs
		const formattedInputs = (aiInputsRaw || []).map((item) => {
			const input = item.input;

			// Ambil enum values jika ada
			const enumValues = (input.enum?.values || []).map((v: { value: string }) => v.value) || [];

			return {
				name: input.name,
				description: input.description,
				type: input.type,
				required: input.required,
				enum: enumValues.length > 0 ? enumValues : undefined,
			};
		});

		// Hit API
		const res = await cekatApiRequest.call(
			this,
			'POST',
			'/business_workflows/ai-tools/create',
			{
				ai_agent_ids: agentIds,
				name,
				description,
				ai_inputs: formattedInputs,
				webhook_url: webhookUrl,
				workflow_id: workflowId,
			},
			'server',
		);

		console.log(res);
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
	async webhook(this: IWebhookFunctions): Promise<any> {
		const workflowName = this.getWorkflow().name;
		const workflowId = this.getWorkflow().id;
		const workflowIsActive = this.getWorkflow().active;

		const body = this.getBodyData();
		const { typeVersion: nodeVersion, type: nodeType } = this.getNode();

		if (nodeVersion >= 1 && nodeType === 'CUSTOM.cekatAiToolTrigger') {
			checkResponseModeConfiguration(this);
		}

		const response: INodeExecutionData = {
			json: {
				body,
				context: {
					workflowName,
					workflowId,
					workflowIsActive,
				},
			},
		};

		return {
			workflowData: [[response]], // Harus array dua dimensi
		};
	}
	methods = {
		loadOptions: {
			...options,
			getAIAgentsDropdown: options.getAIAgentsDropdown,
		},
	};
}
