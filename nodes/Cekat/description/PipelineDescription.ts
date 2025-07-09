import type { INodeProperties } from 'n8n-workflow';

export const pipelineOperation: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pipeline'],
			},
		},
		options: [
			{
				name: 'Set Pipeline Status',
				value: 'setPipelineStatus',
				action: 'Set the status of a pipeline',
			},
		],
		default: 'setPipelineStatus',
	},
];

export const pipelineFields: INodeProperties[] = [
	{
		displayName: 'Pipeline Status ID',
		name: 'pipelineStatusId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the pipeline status to be set',
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['setPipelineStatus'],
			},
		},
	},
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the conversation to apply the pipeline status to',
		displayOptions: {
			show: {
				resource: ['pipeline'],
				operation: ['setPipelineStatus'],
			},
		},
	},
];
