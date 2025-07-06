import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { cekatApiRequest } from '../GenericFunctions';
import { messageFields, messageOperations } from './CekatDescription';
import * as options from '../../CekatTrigger/methods';

export class CekatSendMessage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cekat Send Message',
		name: 'cekatSendMessage',
		group: ['input'],
		version: 1,
		description: 'Send messages through Cekat API',
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		defaults: {
			name: 'Cekat Send Message',
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
				type: 'hidden',
				default: 'message',
			},
			...messageOperations,
			...messageFields,
		],
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

					const response = await cekatApiRequest.call(this, 'POST', '/messages/whatsapp', body);

					returnData.push({
						json: response,
					});
				} else if (resource === 'message' && operation === 'sendTemplateMessage') {
					const inboxId = this.getNodeParameter('inboxId', i) as string;
					const receiverPhoneNumber = this.getNodeParameter('receiverPhoneNumber', i) as string;

					const templateId = this.getNodeParameter('templateId', i);

					const templates = await cekatApiRequest.call(
						this,
						'GET',
						'/templates',
						{},
						{ inbox_id: inboxId },
					);
					const selectedTemplate = templates.data.find((t: any) => t.id === templateId);
					if (!selectedTemplate) {
						throw new Error(`Template with ID ${templateId} not found in inbox ${inboxId}`);
					}

					const whatsappTemplateId = selectedTemplate.wa_template_id;
					const bodyVarsRaw = this.getNodeParameter('bodyVariables', i, []);
					const bodyVarsArray = Array.isArray(bodyVarsRaw) ? bodyVarsRaw : [];
					const bodyVariables = bodyVarsArray.map((v: any) => v.variable.value);

					const bodyVarDummy = ['Customer'];
					const body = {
						inbox_id: inboxId,
						wa_template_id: whatsappTemplateId,
						// "otp_code": "552345", //max 15 char for auth only
						template_body_variables: bodyVarDummy,
						phone_number: receiverPhoneNumber,
						phone_name: 'customer',
					};

					const response = await cekatApiRequest.call(this, 'POST', '/templates/send', body);

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

	methods = {
		loadOptions: {
			getInboxes: options.getInboxes,
			getTemplates: options.getTemplates,
		},
	};
}
