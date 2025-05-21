import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // SQL User Reference
      required: true,
      unique: true,
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CartItem'
    }],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total amount before saving
cartSchema.pre("save", async function (next) {
  try {
    // Populate items to get their prices and quantities
    await this.populate('items');
    
    // Calculate total and round to 2 decimal places
    this.totalAmount = Number(this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2));
    
    next();
  } catch (error) {
    next(error);
  }
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
