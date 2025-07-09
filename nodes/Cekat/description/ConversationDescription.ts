import type { INodeProperties } from 'n8n-workflow';

export const conversationOperation: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
			},
		},
		options: [
			{
				name: 'Resolve Conversation',
				value: 'resolveConversation',
				action: 'Resolve a conversation',
			},
			{
				name: 'Assign Label',
				value: 'assignLabel',
				action: 'Assign a label to a conversation',
			},
			{
				name: 'Assign Agent',
				value: 'assignAgent',
				action: 'Assign a agent to a conversation',
			},
			{
				name: 'Add Collaborator',
				value: 'addCollaborator',
				action: 'Add a collaborator to a conversation',
			},
			{
				name: 'Change Stage Status',
				value: 'changeStageStatus',
				action: 'Change the stage status of a conversation',
			},
		],
		default: 'assignAgent',
	},
];

export const conversationFields: INodeProperties[] = [
	// 📌 Digunakan oleh SEMUA operation
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the conversation',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: [
					'resolveConversation',
					'assignLabel',
					'assignAgent',
					'addCollaborator',
					'changeStageStatus',
				],
			},
		},
	},

	// 📌 assignAgent & addCollaborator
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the agent',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['assignAgent', 'addCollaborator'],
			},
		},
	},

	// 📌 assignLabel only
	{
		displayName: 'Label ID',
		name: 'labelId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the label',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['assignLabel'],
			},
		},
	},
	{
		displayName: 'Stage Status',
		name: 'stage_status',
		type: 'string',
		default: '',
		required: true,
		description: 'The stage status to change the conversation to',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['changeStageStatus'],
			},
		},
	},
];
