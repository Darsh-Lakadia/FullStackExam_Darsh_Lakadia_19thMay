import express from 'express';
import { createOrder, getUserOrders, getOrder, updateOrderStatus, updatePaymentStatus } from '../controllers/OrderController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// User routes
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

// Admin routes
router.put('/:id/status', isAdmin, updateOrderStatus);
router.put('/:id/payment', isAdmin, updatePaymentStatus);

export default router; 
