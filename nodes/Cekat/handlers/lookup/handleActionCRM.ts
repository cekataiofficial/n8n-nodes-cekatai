import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cekatApiRequest } from '../../GenericFunctions';

export async function handleCreateItem(
	context: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData> {
	const boardId = context.getNodeParameter('boardId', i) as string;
	const groupId = context.getNodeParameter('groupId', i, '') as string;
	const itemName = context.getNodeParameter('itemName', i, '') as string;

	
	// Build request body
	const requestBody: any = {};

	const columns = context.getNodeParameter('columns', i, {}) as { column: Array<{ columnName: string, value: string }> };

if (columns?.column?.length) {
	for (const col of columns.column) {
		if (col.columnName && col.value !== undefined) {
			requestBody[col.columnName] = col.value; // col.columnName = nama kolom
		}
	}
}

	


	if (itemName) {
		requestBody.item_name = itemName;
	}
	// Add group_id if provided
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
	const columnToUpdate = context.getNodeParameter('columnToUpdate', i) as string;
	const newValue = context.getNodeParameter('newValue', i) as string;
	
	const requestBody: any = {};
	if (columnToUpdate && newValue !== undefined) {
		requestBody[columnToUpdate] = newValue; // columnToUpdate = columnName
	}
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
			{ item_ids: itemIds }, // 👈 batch delete langsung
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

