const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  products: [
    {
        type: Schema.Types.objectId,
        ref: 'Product',
        requires: true
    }
  ]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
