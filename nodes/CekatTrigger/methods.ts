import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { cekatApiRequest } from './GenericFunctions';


export async function getInboxes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    // Retrieve the credentials object declared on the node
    const credentials = await this.getCredentials('CekatOpenApi');
    if (!credentials || !credentials.apiKey) {
      throw new Error('No Cekat API Key credentials found!');
    }   
    const apiKey = credentials.apiKey as string;
    const data = await cekatApiRequest.call(this, 'GET', '/business_workflows/inboxes', {}, {
        apiKey,
    });
    return data.map((inbox: { id: string, name: string, type: string, phone_number: string }) => ({
      name: inbox.name + (inbox.type ? ` (${inbox.type}${inbox.phone_number ? ` - ${inbox.phone_number}` : ''})` : ''),
      value: inbox.id,
    }));
  }


