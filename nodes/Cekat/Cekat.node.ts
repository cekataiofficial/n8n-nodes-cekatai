import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { cekatApiRequest } from './GenericFunctions';
import { messageOperations, messageFields, templateFields } from './description/MessageDescription';

import * as options from './methods';
import { conversationOperation } from './description/ConversationDescription';
import { lookupFields, lookupOperation } from './description/LookupDescription';
import { contactOperation } from './description/ContactDescription';
import { webhookOperation } from './description/WebhookDescription';
import { pipelineOperation } from './description/PipelineDescription';

export class Cekat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cekat',
		name: 'cekat',
		group: ['transform'],
		version: 1,
		description: 'Interact with Cekat API',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Cekat',
		},
		inputs: ['main' as any],
		outputs: ['main' as any],
		icon: 'file:cekat.svg',
		credentials: [
			{
				name: 'CekatOpenApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'Lookup', value: 'lookup' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Webhook', value: 'webhook' },
					{ name: 'Pipeline', value: 'pipeline' },
					{ name: 'Conversation', value: 'conversation' },
					{ name: 'Message', value: 'message' },
					{ name: 'Template', value: 'template' },
				],
				default: 'message',
			},

			//lookup operations && fields
			...lookupOperation,
			...lookupFields,
			//contact operations && fields
			...contactOperation,

			//webhook operations && fields
			...webhookOperation,

			//pipeline operations && fields
			...pipelineOperation,

			//conversation operations && fields
			...conversationOperation,

			//message operations && fields
			...messageOperations,
			...messageFields,
			...templateFields,
		],
	};

	methods = {
		loadOptions: {
			getInboxes: options.getInboxes,
			getTemplates: options.getTemplates,
			getTemplatePreview: options.getTemplatePreview,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'message' && operation === 'sendMessage') {
					const conversationId = this.getNodeParameter('conversationId', i) as string;
					const receiverPhoneNumber = this.getNodeParameter('receiverPhoneNumber', i) as string;
					const text = this.getNodeParameter('text', i) as string;

					const body = {
						conversation_id: conversationId,
						receiver: receiverPhoneNumber,
						message: text,
					};

					const response = await cekatApiRequest.call(
						this,
						'POST',
						'/messages/whatsapp',
						body,
						{},
						'api',
					);

					returnData.push({
						json: response,
					});
				} else if (resource === 'message' && operation === 'sendTemplateMessage') {
					const inboxId = this.getNodeParameter('inboxId', i) as string;
					const receiverName = this.getNodeParameter('receiverName', i) as string;
					const receiverPhoneNumber = this.getNodeParameter('receiverPhoneNumber', i) as string;

					console.log(receiverName);
					const templateId = this.getNodeParameter('templateId', i);

					const templates = await cekatApiRequest.call(
						this,
						'GET',
						'/templates',
						{},
						{ inbox_id: inboxId },

						'api',
					);
					const selectedTemplate = templates.data.find((t: any) => t.id === templateId);
					if (!selectedTemplate) {
						throw new Error(`Template with ID ${templateId} not found in inbox ${inboxId}`);
					}

					const whatsappTemplateId = selectedTemplate.wa_template_id;
					const bodyVarsRaw = this.getNodeParameter('bodyVariables', i, {}) as {
						variable?: { value: string }[];
					};
					const bodyVariables = Array.isArray(bodyVarsRaw.variable)
						? bodyVarsRaw.variable.map((v) => v.value)
						: [];

					const body = {
						inbox_id: inboxId,
						wa_template_id: whatsappTemplateId,
						// "otp_code": "552345", //max 15 char for auth only
						template_body_variables: bodyVariables,
						phone_number: receiverPhoneNumber,
						phone_name: receiverName,
					};

					const response = await cekatApiRequest.call(
						this,
						'POST',
						'/templates/send',
						body,
						{},
						'api',
					);

					returnData.push({
						json: response,
					});
				} else {
					throw new Error(`Unsupported resource (${resource}) or operation (${operation})`);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
