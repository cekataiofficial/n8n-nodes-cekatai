import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { cekatApiRequest } from '../GenericFunctions';

export async function getOrders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const response = await cekatApiRequest.call(
        this,
        'GET',
        '/api/orders',
        {},
        {},
        'staging',
    );

    // Fix: Access orders array from response.data.orders, not response.data
    const orders = response.data.orders || [];

    return orders.map((order: any) => ({
        // Fix: Use order_number for display name since it's more readable
        name: `Order #${order.order_number} - ${order.contact?.display_name || 'No Contact'}`,
        // Fix: Use 'id' field directly
        value: order.id,
    }));
}