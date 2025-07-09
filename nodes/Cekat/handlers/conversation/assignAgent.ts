import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cekatApiRequest } from '../../GenericFunctions';

export async function handleAssignAgent(
	context: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const conversationId = context.getNodeParameter('conversationId', i) as string;
	const agentId = context.getNodeParameter('agentId', i) as string;

	const body = {
		conversation_id: conversationId,
		agent_id: agentId,
	};

	const response = await cekatApiRequest.call(
		context,
		'POST',
		'/business_workflows/conversation/assign-agent',
		body,
		{},
		'server',
	);

	return { json: response };
}
