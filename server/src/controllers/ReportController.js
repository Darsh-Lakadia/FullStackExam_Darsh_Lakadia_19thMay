import Order from '../models/sql/Order.js';
import OrderItem from '../models/sql/OrderItem.js';
import Product from '../models/mongodb/Product.js';
import sequelize from '../models/sql/index.js';
import { Op } from 'sequelize';
import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/enums.js';

export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause = {
      status: ORDER_STATUS.DELIVERED,
      paymentStatus: PAYMENT_STATUS.PAID
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [{
        model: OrderItem,
        as: 'items',
        attributes: ['quantity', 'price', 'productId']
      }]
    });

    const report = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0),
      averageOrderValue: 0,
      topSellingProducts: {},
      salesByDate: {}
    };

    // Calculate average order value
    if (orders.length > 0) {
      report.averageOrderValue = report.totalRevenue / orders.length;
    }

    // Process orders for detailed statistics
    for (const order of orders) {
      // Track sales by date
      const date = order.createdAt.toISOString().split('T')[0];
      report.salesByDate[date] = (report.salesByDate[date] || 0) + parseFloat(order.totalAmount);

      // Track top selling products
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          const productId = item.productId;
          if (!report.topSellingProducts[productId]) {
            report.topSellingProducts[productId] = {
              totalQuantity: 0,
              totalRevenue: 0
            };
          }
          report.topSellingProducts[productId].totalQuantity += item.quantity;
          report.topSellingProducts[productId].totalRevenue += item.quantity * parseFloat(item.price);
        }
      }
    }

    // Sort top selling products by quantity
    report.topSellingProducts = Object.entries(report.topSellingProducts)
      .sort(([, a], [, b]) => b.totalQuantity - a.totalQuantity)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    res.json(report);
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ message: 'Error generating sales report', error: error.message });
  }
};

export const getProductPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const productPerformance = await OrderItem.findAll({
      include: [{
        model: Order,
        where: whereClause,
        attributes: []
      }, {
        model: Product,
        attributes: ['name', 'price']
      }],
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'totalRevenue']
      ],
      group: ['productId', 'Product.id', 'Product.name', 'Product.price']
    });

    res.json(productPerformance);
  } catch (error) {
    res.status(500).json({ message: 'Error generating product performance report', error: error.message });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find({}, 'name category stock price');
    
    const inventory = products.map(product => {
      return {
        name: product.name,
        category: product.category,
        stock: product.stock,
        price: product.price,
        totalValue: product.stock * product.price
      };
    });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error generating inventory report', error: error.message });
  }
};

export const getCategoryPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const whereClause = {};

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const categoryPerformance = await OrderItem.findAll({
      include: [{
        model: Order,
        where: whereClause,
        attributes: []
      }],
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'totalRevenue']
      ],
      group: ['productId']
    });

    const productIds = categoryPerformance.map(p => p.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const categoryReport = products.reduce((acc, product) => {
      const performance = categoryPerformance.find(p => p.productId === product._id.toString());
      if (!acc[product.category]) {
        acc[product.category] = {
          totalQuantity: 0,
          totalRevenue: 0,
          productCount: 0
        };
      }
      if (performance) {
        acc[product.category].totalQuantity += parseInt(performance.totalQuantity);
        acc[product.category].totalRevenue += parseFloat(performance.totalRevenue);
      }
      acc[product.category].productCount++;
      return acc;
    }, {});

    res.json(categoryReport);
  } catch (error) {
    res.status(500).json({ message: 'Error generating category performance report', error: error.message });
  }
}; 
