import type { INodeProperties } from 'n8n-workflow';

export const actionOrderOperation: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['action'],
            },
        },
        options: [
            {
                name: 'Update Order',
                value: 'updateOrder',
                action: 'Update order',
            },
        ],
        default: 'updateOrder',
    },
];

export const actionOrderFields: INodeProperties[] = [
    // ========== ORDER ID FIELD ==========
    {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getOrders',
        },
        default: '',
        required: true,
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        displayOptions: {
            show: {
                resource: ['action'],
                operation: ['updateOrder'],
            },
        },
    },

    // ========== ORDER STATUS FIELD ==========
    {
        displayName: 'Order Status',
        name: 'orderStatus',
        type: 'options',
        options: [
            { name: 'Pending', value: 'pending' },
            { name: 'Processing', value: 'processing' },
            { name: 'Shipping', value: 'shipping' },
            { name: 'Cancelled', value: 'cancelled' },
            { name: 'Completed', value: 'completed' },
        ],
        default: '',
        description: 'Select the order status',
        displayOptions: {
            show: {
                resource: ['action'],
                operation: ['updateOrder'],
            },
        },
    },

    // ========== PAYMENT STATUS FIELD ==========
    {
        displayName: 'Payment Status',
        name: 'paymentStatus',
        type: 'options',
        options: [
            { name: 'Pending', value: 'pending' },
            { name: 'Paid', value: 'paid' },
            { name: 'Expired', value: 'expired' },
            { name: 'Settled', value: 'settled' },
        ],
        default: '',
        description: 'Select the payment status',
        displayOptions: {
            show: {
                resource: ['action'],
                operation: ['updateOrder'],
            },
        },
    },

    // ========== PAYMENT METHOD FIELD ==========
    {
        displayName: 'Payment Method',
        name: 'paymentMethod',
        type: 'options',
        options: [
            { name: 'Xendit', value: 'xendit' },
            { name: 'Manual', value: 'manual' },
            { name: 'Custom', value: 'custom' },
        ],
        default: '',
        description: 'Select the payment method',
        displayOptions: {
            show: {
                resource: ['action'],
                operation: ['updateOrder'],
            },
        },
    },
];