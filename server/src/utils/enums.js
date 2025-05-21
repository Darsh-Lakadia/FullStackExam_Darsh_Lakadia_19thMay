export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const orderStatuses = Object.values(ORDER_STATUS);

export const isValidOrderStatus = (status) => {
  return orderStatuses.includes(status);
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed'
};

export const paymentStatuses = Object.values(PAYMENT_STATUS);

export const isValidPaymentStatus = (status) => {
  return paymentStatuses.includes(status);
}; 
