import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleLookup } from './lookup/handleLookup';
import { handleSendMessage } from './message/sendMessage';
import { handleSendTemplateMessage } from './message/sendTemplateMessage';
import { handleUpdateAdditionalData } from './contact/updateAdditionalData';
import { handleSubscribeWebhook } from './webhook/subscribe';
import { handleSetPipelineStatus } from './conversation/assignPipeline';

import { handleAssignLabel } from './conversation/assignLabel';
import { handleRemoveLabel } from './conversation/removeLabel';
import { handleAssignAgent } from './conversation/assignAgent';
import { handleAddCollaborator } from './conversation/addCollaborator';
import { handleChangeStageStatus } from './conversation/changeStageStatus';
import { handleResolveConversation } from './conversation/resolve';
import { handleBlockAi } from './conversation/blockAi';
import { handleUnblockAi } from './conversation/unblockAi';

export const handlers: Record<
	string,
	(context: IExecuteFunctions, i: number) => Promise<INodeExecutionData>
> = {
	'message:sendMessage': handleSendMessage,
	'message:sendTemplateMessage': handleSendTemplateMessage,

	'contact:updateAdditionalData': handleUpdateAdditionalData,

	'webhook:subscribe': handleSubscribeWebhook,
	'webhook:unsubscribe': handleSubscribeWebhook,

	'conversation:setPipelineStatus': handleSetPipelineStatus,
	'conversation:resolveConversation': handleResolveConversation,
	'conversation:blockAI': handleBlockAi,
	'conversation:unblockAI': handleUnblockAi,
	'conversation:assignLabel': handleAssignLabel,
	'conversation:removeLabel': handleRemoveLabel,
	'conversation:assignAgent': handleAssignAgent,
	'conversation:addCollaborator': handleAddCollaborator,
	'conversation:changeStageStatus': handleChangeStageStatus,

	// other handlers...
	'lookup:getMessages': handleLookup,
	'lookup:getAllTemplates': handleLookup,
	'lookup:getLabels': handleLookup,
	'lookup:getInboxes': handleLookup,
	'lookup:getAgents': handleLookup,
	'lookup:getContact': handleLookup,
	'lookup:getPipelineStatuses': handleLookup,
	'lookup:getSubscribedWebhooks': handleLookup,
};
