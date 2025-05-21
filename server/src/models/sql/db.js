import sequelize from './index.js';
import User from './User.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

// Define associations
const initializeAssociations = () => {
  // User - Order associations
  User.hasMany(Order, { 
    foreignKey: "userId",
    foreignKeyConstraint: true,
    onDelete: 'CASCADE'
  });

  Order.belongsTo(User, { 
    foreignKey: "userId",
    foreignKeyConstraint: true
  });

  // Order - OrderItem associations
  Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE'
  });

  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    foreignKeyConstraint: true
  });

  console.log('Model associations initialized ==============');
};

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate(); 
    console.log("Connection to MySQL Docker container has been established successfully.");
    
    initializeAssociations();
    
    await sequelize.sync();
    console.log("Database tables have been synchronized successfully.");
  } catch (err) {
    console.error("Database initialization error:", err);
    throw err;
  }
};

export { initializeDatabase, User, Order, OrderItem }; 
