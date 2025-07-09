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
			{
				name: 'Set Pipeline Status',
				value: 'setPipelineStatus',
				action: 'Set the status of a pipeline',
			},
		],
		default: 'assignAgent',
	},
];

export const conversationFields: INodeProperties[] = [
	// 📌 Digunakan oleh SEMUA operation

	// 📌 assignAgent & addCollaborator
	{
		displayName: 'Select Agent or Agent ID',
		name: 'agentId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAgentsDropdown',
		},
		default: '',
		required: true,
		description: 'choose of the agent to assign or add as collaborator',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['assignAgent', 'addCollaborator'],
			},
		},
	},

	// 📌 assignLabel only
	{
		displayName: 'Select Label or Label ID',
		name: 'labelId',

		type: 'options',
		default: '',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getLabelsDropdown',
		},
		description: 'choose of the Label to assign',
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
		type: 'options',
		options: [
			{ name: 'Assigned', value: 'assigned' },
			{ name: 'Pending', value: 'pending' },
			{ name: 'Open', value: 'open' },
			{ name: 'Resolved', value: 'resolved' },
		],
		default: 'assigned',
		required: true,
		description: 'The stage status to change the conversation to',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['changeStageStatus'],
			},
		},
	},
	{
		displayName: 'Select Pipeline or Pipeline ID',
		name: 'pipelineStatusId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPipelinesDropdown',
		},
		default: '',
		required: true,
		description: 'The ID of the pipeline status to be set',
		displayOptions: {
			show: {
				resource: ['conversation'],
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
				resource: ['conversation'],
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
];
