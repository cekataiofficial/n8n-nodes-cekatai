import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { cekatApiRequest } from './GenericFunctions';
import * as options from './methods';

export class CekatAiAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cekat AI Agent',
		name: 'cekatAiAgent',
		group: ['transform'],
		version: 1,
		description: 'Send messages to a Cekat AI Agent and receive response',
		defaults: {
			name: 'Cekat AI Agent',
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
				displayName: 'AI Agent',
				name: 'ai_agent_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAIAgentsDropdown',
				},
				required: true,
				default: '',
			},
			{
				displayName: 'Messages',
				name: 'messages',
				type: 'collection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Tambahkan beberapa pesan dengan form yang rapi',
				options: [
					{
						displayName: 'Message',
						name: 'messageItem',
						values: [
							{
								displayName: 'ID',
								name: 'id',
								type: 'number',
								default: 1,
							},
							{
								displayName: 'Message',
								name: 'message',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Sent By',
								name: 'sent_by_type',
								type: 'options',
								options: [
									{ name: 'User', value: 'user' },
									{ name: 'AI', value: 'ai' },
								],
								default: 'user',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Text', value: 'text' },
									{ name: 'Image', value: 'image' },
									{ name: 'Audio', value: 'audio' },
									{ name: 'Video', value: 'video' },
									{ name: 'File', value: 'file' },
								],
								default: 'text',
							},
							{
								displayName: 'Media URL',
								name: 'media_url',
								type: 'string',
								default: '',
								displayOptions: {
									show: {
										type: ['image', 'audio', 'video', 'file'],
									},
								},
							},
							{
								displayName: 'Media Type',
								name: 'media_type',
								type: 'options',
								options: [
									{ name: 'Image', value: 'image' },
									{ name: 'Audio', value: 'audio' },
									{ name: 'Video', value: 'video' },
									{ name: 'File', value: 'file' },
								],
								default: 'image',
								displayOptions: {
									show: {
										type: ['image', 'audio', 'video', 'file'],
									},
								},
							},
							{
								displayName: 'Created At',
								name: 'created_at',
								type: 'dateTime',
								default: '',
							},
						],
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			getAIAgentsDropdown: options.getAIAgentsDropdown,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const aiAgentId = this.getNodeParameter('ai_agent_id', i) as string;
			const messagesParam = this.getNodeParameter('messages', i) as unknown as any;

			let messages: any[] = [];
			if (typeof messagesParam === 'string') {
				messages = JSON.parse(messagesParam);
			} else if (Array.isArray(messagesParam)) {
				messages = messagesParam;
			} else if (
				messagesParam &&
				messagesParam.messageItem &&
				Array.isArray(messagesParam.messageItem)
			) {
				messages = messagesParam.messageItem;
			} else {
				messages = [messagesParam];
			}

			const body = {
				ai_agent_id: aiAgentId,
				messages,
			} as any;

			const response = await cekatApiRequest.call(
				this,
				'POST',
				'/api/ai_response/beta',
				body,
				{},
				'api',
			);

			returnData.push({ json: response, pairedItem: i });
		}

		return [returnData];
	}
}
