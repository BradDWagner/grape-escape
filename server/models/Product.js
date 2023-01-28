const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0.99
  },
  tags: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    }
  ],
  reviews: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }
  ]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
