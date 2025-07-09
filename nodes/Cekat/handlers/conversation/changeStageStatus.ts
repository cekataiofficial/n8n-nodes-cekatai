import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cekatApiRequest } from '../../GenericFunctions';

export async function handleChangeStageStatus(
	context: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const conversationId = context.getNodeParameter('conversationId', i) as string;
	const pipelineStatusId = context.getNodeParameter('pipelineStatusId', i) as string;
	const credentials = await context.getCredentials('CekatOpenApi');

	const body = {
		conversation_id: conversationId,
		pipeline_status_id: pipelineStatusId,
	};

	const response = await cekatApiRequest.call(
		context,
		'POST',
		'/business_workflows/conversation/update-stage-status',
		body,
		{ Authorization: `Bearer ${credentials.apiKey}` },
		'server',
	);

	return { json: response };
}
