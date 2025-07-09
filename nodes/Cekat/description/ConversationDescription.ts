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
