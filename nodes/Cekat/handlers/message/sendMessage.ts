import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cekatApiRequest } from '../../GenericFunctions';

export async function handleSendMessage(
	context: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const conversationId = context.getNodeParameter('conversationId', i) as string;
	const receiverPhoneNumber = context.getNodeParameter('receiverPhoneNumber', i) as string;
	const text = context.getNodeParameter('text', i) as string;

	const body = {
		conversation_id: conversationId,
		receiver: receiverPhoneNumber,
		message: text,
	};

	const response = await cekatApiRequest.call(
		context,
		'POST',
		'/messages/whatsapp',
		body,
		{},
		'api',
	);

	return {
		json: response,
	};
}
