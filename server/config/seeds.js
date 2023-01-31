const db = require('./connection');
const { User, Product, Tag, Review } = require('../models');

db.once('open', async () => {
    await User.deleteMany();

    const users = await User.insertMany([
        {
            firstName: 'Brad',
            lastName: 'Wagner',
            email: 'brad@wagner.com',
            password: 'bradwagner',
        },
        {
            firstName: 'Shel',
            lastName: 'Cloyd',
            email: 'shel@cloyd.com',
            password: 'shelcloyd',
        },
        {
            firstName: 'Alice',
            lastName: 'Nouhouemale',
            email: 'alice@nouhouemale.com',
            password: 'alicenouhouemale',
        },
        {
            firstName: 'Chris',
            lastName: 'Kang',
            email: 'chris@kang.com',
            password: 'chriskang',
        },
    ]);

    console.log('Users seeded');

    await Tag.deleteMany();

    const tags = await Tag.insertMany([
        { name: 'red' },
        { name: 'white'},
        { name: 'rose'},
        { name: 'dry'},
        { name: 'sweet'},
        { name: 'dessert'},
        { name: 'fruit'}
    ]);

    console.log('Tags seeded');

    await Review.deleteMany();

    const reviews = await Review.insertMany([
        { comment: 'delicious', user: users[0]._id },
        { comment: 'very fruity', user: users[1]._id },
        { comment: 'Not red and not white!', user: users[2]._id },
        { comment: 'sooooo good', user: users[3]._id, likes: 1 },
        { comment: 'I like wine', user: users[0]._id },
        { comment: 'yummy', user: users[1]._id }
    
    ]);

    console.log('Reviews seeded')

    await Product.deleteMany();

    const products = await Product.insertMany([
        {
            name: 'Dry Red',
            description: 'A dry red wine',
            image: 'image.jpg',
            price: 12.99,
            tags: [
                tags[0]._id, tags[3]._id
            ],
            reviews: [ reviews[0]._id ] 
        },
        {
            name: 'Sweet Red',
            description: 'A sweet red wine',
            image: 'image.jpg',
            price: 14.99,
            tags: [
                tags[0]._id, tags[4]._id, tags[6]._id
            ],
            reviews: [ reviews[1]._id ]
        },
        {
            name: 'rose',
            description: 'a rose wine!',
            image: 'image.jpg',
            price: 15.99,
            tags: [
                tags[2]._id, tags[5]._id
            ],
            reviews: [ reviews[2, 3]._id ]
        },
        {
            name: 'Dry White',
            description: 'A dry white wine',
            image: 'image.jpg',
            price: 12.99,
            tags: [
                tags[1]._id, tags[3]._id
            ],
            reviews: [ reviews[4]._id ]
        },
        {
            name: 'Sweet White',
            description: 'A sweet white wine',
            image: 'image.jpg',
            price: 17.99,
            tags: [
                tags[1]._id, tags[4]._id
            ],
            reviews: []
        }
    ]);

    console.log('Products seeded')

    process.exit();
})