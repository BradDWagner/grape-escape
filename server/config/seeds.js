const db = require('./connection');
const { User, Product, Tag, Review } = require('../models');

db.once('open', async () => {
    await User.deleteMany();
})