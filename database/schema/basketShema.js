const { Schema, model } = require("mongoose");

const basketSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      items: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
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