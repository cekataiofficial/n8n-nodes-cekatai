import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ApplicationError,
} from 'n8n-workflow';

import * as options from './methods';

import { lookupOperation as lookupCRMOperation, lookupFields as lookupCRMFields } from './description/LookupCRMDescription';
import { handlers } from './handlers';
import { actionCRMFields, actionCRMOperation } from './description/ActionCRMDescription';

export class CekatCrm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cekat CRM',
		name: 'cekatCrm',
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
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const key = `${resource}:${operation}`;

				const handler = handlers[key];

				if (!handler) {
					throw new ApplicationError(`No handler registered for resource:operation "${key}"`);
				}

				const result = await handler(this, i);
				returnData.push(result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
