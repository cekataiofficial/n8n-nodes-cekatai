import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ApplicationError,
} from 'n8n-workflow';

import * as options from './methods';
import { handlers } from './handlers';
import { actionCRMFields, actionCRMOperation, processCreateItemColumns, processUpdateItemColumn } from './description/ActionCRMDescription';
import { lookupCRMFields, lookupCRMOperation } from './description/LookupCRMDescription';

// PERBAIKAN UTAMA: Pastikan class name dan export sesuai dengan file name
export class CekatCRM implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cekat CRM',
		name: 'cekatCrm', // HARUS sama dengan class name (camelCase)
		group: ['transform'],
		version: 1,
		description: 'Interact with Cekat CRM API untuk mengelola contact dan lookup data',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: { 
			name: 'Cekat CRM',
		},
		inputs: ['main' as any],
		outputs: ['main' as any],
		icon: 'file:cekat.svg',
		credentials: [
			{
				name: 'CekatOpenApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Lookup', value: 'lookup' },
					{ name: 'Action', value: 'action' },
				],
				default: 'lookup',
			},
			// Lookup operations
			...lookupCRMOperation,
			...lookupCRMFields,
			// Action operations
			...actionCRMOperation,
			...actionCRMFields,
		],
	};

	methods = {
		loadOptions: {
			getBoards: options.getBoards,
			getItems: options.getItems,
			getBoardColumns: options.getBoardColumns,
			getStageOptions: options.getStageOptions,
			getGroups: options.getGroups,
			getLabelsDropdown: options.getLabelsDropdown,
			getPipelinesDropdown: options.getPipelinesDropdown,
			getInboxesDropdown: options.getInboxesDropdown,
			getAgentsDropdown: options.getAgentsDropdown,
			getAIAgentsDropdown: options.getAIAgentsDropdown,
			getTemplates: options.getTemplates,


		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
	
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
	
				// Process column data based on operation before calling handler
				if (operation === 'createItem') {
					const columns = this.getNodeParameter('columns.column', i, []) as any[];
					const formattedColumns = processCreateItemColumns(columns);
					
					// Store formatted columns in a way that handlers can access it
					// Option 1: Store in items[i].json for handler to access
					items[i].json.formattedColumns = formattedColumns;
					
					// Option 2: Or pass directly to handler if you modify handler signature
					
				} else if (operation === 'updateItem') {
					const columnName = this.getNodeParameter('columnToUpdate', i) as string;
					const valueType = this.getNodeParameter('valueType', i) as string;
					
					// Get all parameters for this item
					const allParams = {
						textValue: this.getNodeParameter('textValue', i, '') as string,
						stringValue: this.getNodeParameter('stringValue', i, '') as string, // fallback
						numberValue: this.getNodeParameter('numberValue', i, 0) as number,
						dateValue: this.getNodeParameter('dateValue', i, '') as string,
						emailValue: this.getNodeParameter('emailValue', i, '') as string,
						phoneValue: this.getNodeParameter('phoneValue', i, '') as string,
						longTextValue: this.getNodeParameter('longTextValue', i, '') as string,
						checkboxValue: this.getNodeParameter('checkboxValue', i, false) as boolean,
						selectValue: this.getNodeParameter('selectValue', i, '') as string,
						dropdownValues: this.getNodeParameter('dropdownValues', i, '') as string,
						timelineFrom: this.getNodeParameter('timelineFrom', i, '') as string,
						timelineTo: this.getNodeParameter('timelineTo', i, '') as string,
						files: this.getNodeParameter('files', i, {}) as any,
						agentIds: this.getNodeParameter('agentIds', i, []) as string[],
						contactIds: this.getNodeParameter('contactIds', i, []) as string[],
						companyIds: this.getNodeParameter('companyIds', i, []) as string[],
						orderIds: this.getNodeParameter('orderIds', i, []) as string[],
						subscriptionIds: this.getNodeParameter('subscriptionIds', i, []) as string[],
						conversationValue: this.getNodeParameter('conversationValue', i, '') as string,
						referenceIds: this.getNodeParameter('referenceIds', i, '') as string,
					};
					
					const formattedValue = processUpdateItemColumn(columnName, valueType, allParams);
					
					// Store formatted value for handler to access
					items[i].json.formattedValue = formattedValue;
					items[i].json.columnName = columnName;
				}
	
				const key = `${resource}:${operation}`;
				const handler = handlers[key];
	
				if (!handler) {
					throw new ApplicationError(`No handler registered for resource:operation "${key}"`);
				}
	
				const result = await handler(this, i);
				returnData.push(result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ 
						json: { error: (error as Error).message }, 
						pairedItem: i 
					});
					continue;
				}
				throw error;
			}
		}
	
		return [returnData];
	}
}