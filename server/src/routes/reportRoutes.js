import express from 'express';
import { getSalesReport, getProductPerformance, getInventoryReport, getCategoryPerformance } from '../controllers/ReportController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All report routes require admin authentication
router.use(authenticate, isAdmin);

router.get('/sales', getSalesReport);
router.get('/products', getProductPerformance);
router.get('/inventory', getInventoryReport);
router.get('/categories', getCategoryPerformance);

export default router; 
