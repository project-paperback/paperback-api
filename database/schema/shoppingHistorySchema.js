const { Schema, model } = require("mongoose");

const shoppingHistorySchema = new Schema({
  userEmail: String,
  fbUid: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  purchaseHistory: [{ order: { type: Schema.Types.ObjectId, ref: "Orders" } }],
});

const ShoppingHistory = model("ShoppingHistory", shoppingHistorySchema);

module.exports = ShoppingHistory;
