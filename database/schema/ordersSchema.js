const { Schema, model } = require("mongoose");

const ordersSchema = new Schema({
  fbUid: String,
  productsBought: [
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
  purchaseDate: Date,
  invoiceUrl: String,
});

const Orders = model("Orders", ordersSchema);

module.exports = Orders;
