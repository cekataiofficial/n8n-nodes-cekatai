import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cekatApiRequest } from '../../GenericFunctions';

export async function handleAddAdditionalData(
	context: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const contactId = context.getNodeParameter('contactId', i) as string;

	const additionalData = context.getNodeParameter('additionalData', i, {}) as {
		data?: { value: string }[];
	};
	const bodyAdditionalData = Array.isArray(additionalData.data)
		? additionalData.data.map((v) => v.value)
		: [];
	const body = {
		contact_id: contactId,
		additional_data: bodyAdditionalData,
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
