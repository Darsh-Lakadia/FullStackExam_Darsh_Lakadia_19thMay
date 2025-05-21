import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: "id",
    },
    field: 'orderId'
  },
  productId: {
    type: DataTypes.STRING, // MongoDB ObjectId as string
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
  tableName: 'order_items',
  indexes: [
    {
      name: 'order_items_orderId_fk',
      fields: ['orderId']
    }
  ]
});

export default OrderItem; 
