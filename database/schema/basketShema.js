const { Schema, model } = require("mongoose");

const basketSchema = new Schema({
    userEmail : String,
    fbUid: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      items: [{
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
          required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
          },
        }]
})

const Basket = model("Basket", basketSchema);

module.exports = Basket;