import { DataTypes } from "sequelize";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../utils/enums.js";
import sequelize from "./index.js";

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    field: 'userId'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
    defaultValue: ORDER_STATUS.PENDING,
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
    defaultValue: PAYMENT_STATUS.PENDING,
  },
}, {
  timestamps: true,
  tableName: 'orders',
  indexes: [
    {
      name: 'orders_userId_fk',
      fields: ['userId']
    }
  ]
});

export default Order;
