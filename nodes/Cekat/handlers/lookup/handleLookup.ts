import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cekatApiRequest } from '../../GenericFunctions';
export async function handleLookup(
	context: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const operation = context.getNodeParameter('operation', i) as string;

	switch (operation) {
		case 'getMessages': {
			const conversationId = context.getNodeParameter('conversationId', i) as string;
			const res = await cekatApiRequest.call(
				context,
				'GET',
				`/conversations/${conversationId}/messages`,
			);
			return { json: res };
		}

		case 'getTemplates': {
			const inboxId = context.getNodeParameter('inboxId', i) as string;
			const res = await cekatApiRequest.call(
				context,
				'GET',
				'/templates',
				{},
				{ inbox_id: inboxId },
			);
			return { json: res };
		}

		case 'getLabels':
		case 'getInboxes':
		case 'getAgents':
		case 'getPipelineStatuses':
		case 'getSubscribedWebhooks': {
			const pathMap: Record<string, string> = {
				getLabels: '/labels',
				getInboxes: '/inboxes',
				getAgents: '/agents',
				getPipelineStatuses: '/pipeline-statuses',
				getSubscribedWebhooks: '/webhooks/subscribed',
			};

			const res = await cekatApiRequest.call(context, 'GET', pathMap[operation]);
			return { json: res };
		}

		default:
			throw new Error(`Unsupported lookup operation: ${operation}`);
	}
}
