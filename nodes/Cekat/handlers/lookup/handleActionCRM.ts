import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cekatApiRequest } from '../../GenericFunctions';
import { formatColumnValue, processCreateItemColumns, processUpdateItemColumn } from '../../description/ActionCRMDescription';


export async function handleCreateItem(
	context: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const boardId = context.getNodeParameter('boardId', i) as string;
	const groupId = context.getNodeParameter('groupId', i, '') as string;
	const itemName = context.getNodeParameter('itemName', i, '') as string;

	// Ambil semua columns
	const columns = context.getNodeParameter('columns', i, {}) as any;

	// Gunakan helper biar format sesuai tipe
	const columnData = processCreateItemColumns(columns.column || []);

	console.log('columnData', columnData);

	// Build request body
	const requestBody: any = {
		...columnData,
	};

	if (itemName) {
		requestBody.item_name = itemName;
	}
	if (groupId) {
		requestBody.group_id = groupId;
	}

	const response = await cekatApiRequest.call(
		context,
		'POST',
		`/api/crm/boards/${boardId}/items`,
		requestBody,
		{},
		'server',
	);

	return {
		json: {
			success: true,
			operation: 'createItem',
			boardId,
			requestBody,
			response,
		},
		pairedItem: i,
	};
}

export async function handleUpdateItem(
	context: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const boardId = context.getNodeParameter('boardId', i) as string;
	const itemId = context.getNodeParameter('itemId', i) as string;

	// Ambil semua columns dari fixedCollection
	const columns = context.getNodeParameter('columns.column', i, []) as any[];

	const requestBody: Record<string, any> = {};

	for (const col of columns) {
		const columnName = col.columnName as string;
		const valueType = col.valueType as string;

		// Semua params yang mungkin dipakai helper
		const params = {
			stringValue: col.stringValue || '',
			numberValue: col.numberValue || 0,
			dropdownValues: col.dropdownValues || '',
			timelineFrom: col.timelineFrom || '',
			timelineTo: col.timelineTo || '',
			files: col.files || {},
			referenceIds: col.referenceIds || '',
			agentIds: col.agentIds || [],
			contactIds: col.contactIds || [],
			companyIds: col.companyIds || [],
			orderIds: col.orderIds || [],
			subscriptionIds: col.subscriptionIds || [],
			conversationValue: col.conversationValue || '',
			textValue: col.textValue || '',
			dateValue: col.dateValue || '',
			emailValue: col.emailValue || '',
			phoneValue: col.phoneValue || '',
			longTextValue: col.longTextValue || '',
			checkboxValue: col.checkboxValue || false,
			selectValue: col.selectValue || '',
		};

		const formatted = processUpdateItemColumn(columnName, valueType, params);
		Object.assign(requestBody, formatted);
	}

	console.log('requestBody', requestBody);

	const response = await cekatApiRequest.call(
		context,
		'PUT',
		`/api/crm/boards/${boardId}/items/${itemId}`,
		requestBody,
		{},
		'server',
	);

	return {
		json: {
			success: true,
			operation: 'updateItem',
			boardId,
			itemId,
			updatedFields: requestBody,
			response,
		},
		pairedItem: i,
	};
}


export async function handleDeleteItems(
	context: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const boardId = context.getNodeParameter('boardId', i) as string;
	const itemIds = context.getNodeParameter('itemIds', i) as string[];
	const confirmDelete = context.getNodeParameter('confirmDelete', i) as boolean;

	if (!confirmDelete) {
		return {
			json: {
				success: false,
				message: 'Deletion not confirmed. Please check the confirmation checkbox.',
				operation: 'deleteItems',
			},
			pairedItem: i,
		};
	}

	if (!itemIds || itemIds.length === 0) {
		return {
			json: {
				success: false,
				message: 'No valid item IDs provided',
				operation: 'deleteItems',
			},
			pairedItem: i,
		};
	}

	try {
		const response = await cekatApiRequest.call(
			context,
			'DELETE',
			`/api/crm/boards/${boardId}/items`,
			{ item_ids: itemIds },
			{},
			'server',
		);

		return {
			json: {
				success: true,
				operation: 'deleteItems',
				boardId,
				totalItems: itemIds.length,
				itemIds,
				response,
			},
			pairedItem: i,
		};
	} catch (error) {
		return {
			json: {
				success: false,
				operation: 'deleteItems',
				boardId,
				itemIds,
				error: (error as Error).message,
			},
			pairedItem: i,
		};
	}
}
