import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleLookup } from './lookup/handleLookup';
import { handleSendMessage } from './message/sendMessage';
import { handleSendTemplateMessage } from './message/sendTemplateMessage';
import { handleAddAdditionalData } from './contact/addAdditionalData';
import { handleSubscribeWebhook } from './webhook/subscribe';
import { handleSetPipelineStatus } from './pipeline/setStatusPipeline';

import { handleAssignLabel } from './conversation/AssignLabel';
import { handleAssignAgent } from './conversation/AssignAgent';
import { handleAddCollaborator } from './conversation/addCollaborator';
import { handleChangeStageStatus } from './conversation/changeStageStatus';
import { handleResolveConversation } from './conversation/Resolve';

export const handlers: Record<
	string,
	(context: IExecuteFunctions, i: number) => Promise<INodeExecutionData>
> = {
	'message:sendMessage': handleSendMessage,
	'message:sendTemplateMessage': handleSendTemplateMessage,

	'contact:addAdditionalData': handleAddAdditionalData,

	'webhook:subscribe': handleSubscribeWebhook,
	'webhook:unsubscribe': handleSubscribeWebhook,

	'pipeline:setPipelineStatus': handleSetPipelineStatus,

	'conversation:resolveConversation': handleResolveConversation,
	'conversation:assignLabel': handleAssignLabel,
	'conversation:assignAgent': handleAssignAgent,
	'conversation:addCollaborator': handleAddCollaborator,
	'conversation:changeStageStatus': handleChangeStageStatus,

	// other handlers...
	'lookup:getMessages': handleLookup,
	'lookup:getAllTemplates': handleLookup,
	'lookup:getLabels': handleLookup,
	'lookup:getInboxes': handleLookup,
	'lookup:getAgents': handleLookup,
	'lookup:getPipelineStatuses': handleLookup,
	'lookup:getSubscribedWebhooks': handleLookup,
};
