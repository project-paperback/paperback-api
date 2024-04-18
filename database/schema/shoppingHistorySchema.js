const { Schema, model } = require("mongoose");

const shoppingHistorySchema = new Schema({
  userEmail: String,
  fbUid: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  purchaseHistory: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      description: String,
      price: Number,
    },
  ],
});

const ShoppingHistory = model("ShoppingHistory", shoppingHistorySchema);

module.exports = ShoppingHistory;
