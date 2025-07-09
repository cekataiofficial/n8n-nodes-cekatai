import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleLookup } from './lookup/handleLookup';

export const handlers: Record<
	string,
	(context: IExecuteFunctions, i: number) => Promise<INodeExecutionData>
> = {
	// other handlers...
	'lookup:getMessages': handleLookup,
	'lookup:getTemplates': handleLookup,
	'lookup:getLabels': handleLookup,
	'lookup:getInboxes': handleLookup,
	'lookup:getAgents': handleLookup,
	'lookup:getPipelineStatuses': handleLookup,
	'lookup:getSubscribedWebhooks': handleLookup,
};
