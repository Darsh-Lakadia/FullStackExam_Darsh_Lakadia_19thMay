import Order from '../models/sql/Order.js';
import OrderItem from '../models/sql/OrderItem.js';
import Cart from '../models/mongodb/Cart.js';
import Product from '../models/mongodb/Product.js';
import sequelize from '../models/sql/index.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/enums.js';

// Create new order
export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { shippingAddress } = req.body;

    // Get user's cart and populate items
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      totalAmount,
      shippingAddress,
      status: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING
    }, { transaction });

    // Create order items and update product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      // Create order item with string productId
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId.toString(), // Convert ObjectId to string
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }, { transaction });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    await transaction.commit();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        attributes: ['productId', 'quantity', 'price', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: OrderItem,
        attributes: ['productId', 'quantity', 'price', 'name']
      }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error: error.message });
  }
}; 
