import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cekatApiRequest } from '../../GenericFunctions';
import { formatColumnValue } from '../../description/ActionCRMDescription';

export function processCreateItemColumns(columns: any[]): Record<string, any> {
	const processedColumns: Record<string, any> = {};
	
	columns.forEach((col, idx) => {
		console.log(`👉 Column[${idx}] raw:`, col);
		if (col.columnName && col.valueType) {
			const formatted = formatColumnValue(
				col.columnName,
				col.valueType,
				col
			);
			console.log(`👉 Column[${idx}] formatted:`, formatted);
			Object.assign(processedColumns, formatted);
		}
	});
	
	return processedColumns;
}


export function processUpdateItemColumn(columnName: string, valueType: string, params: any): Record<string, any> {
	return formatColumnValue(columnName, valueType, params);
}


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
		'staging',
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
	const valueType = context.getNodeParameter('valueType', i) as string; // 🔥 ambil tipe
	const params = {
		stringValue: context.getNodeParameter('stringValue', i, '') as string,
		numberValue: context.getNodeParameter('numberValue', i, undefined) as number,
		dateValue: context.getNodeParameter('dateValue', i, '') as string,
		agentValue: context.getNodeParameter('agentValue', i, undefined) as number,
		booleanValue: context.getNodeParameter('booleanValue', i, false) as boolean,
	};
	
	const requestBody: any = processUpdateItemColumn(columnToUpdate, valueType, params);

	const response = await cekatApiRequest.call(
		context,
		'PUT',
		`/api/crm/boards/${boardId}/items/${itemId}`,
		requestBody,
		{},
		'staging',
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
			'staging',
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
