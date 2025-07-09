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
