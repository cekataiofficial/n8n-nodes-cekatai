import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cekatApiRequest } from '../../GenericFunctions';

export async function handleUpdateOrder(
    context: IExecuteFunctions,
    i: number,
): Promise<INodeExecutionData> {
    const orderId = context.getNodeParameter('orderId', i) as string;
    const orderStatus = context.getNodeParameter('orderStatus', i, '') as string;
    const paymentStatus = context.getNodeParameter('paymentStatus', i, '') as string;
    const paymentMethod = context.getNodeParameter('paymentMethod', i, '') as string;

    console.log('=== UPDATE ORDER DEBUG ===');
    console.log('orderId:', orderId);
    console.log('orderStatus:', orderStatus);
    console.log('paymentStatus:', paymentStatus);
    console.log('paymentMethod:', paymentMethod);

    // Build request body dengan hanya field yang diisi
    const requestBody: any = {};

    if (orderStatus) requestBody.order_status = orderStatus;
    if (paymentStatus) requestBody.payment_status = paymentStatus;
    if (paymentMethod) requestBody.payment_method = paymentMethod;

    console.log('Final requestBody:', JSON.stringify(requestBody, null, 2));

    const response = await cekatApiRequest.call(
        context,
        'PUT',
        `/api/orders/${orderId}`,
        requestBody,
        {},
        'staging',
    );

    return {
        json: {
            success: true,
            operation: 'updateOrder',
            orderId,
            fieldsCount: Object.keys(requestBody).length,
            updatedFields: requestBody,
            response,
        },
        pairedItem: i,
    };
}