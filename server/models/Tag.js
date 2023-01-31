const mongoose = require('mongoose');

const { Schema } = mongoose;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  products: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
  ]
});

const Category = mongoose.model('Tag', tagSchema);

module.exports = Category;
