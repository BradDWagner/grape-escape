const db = require('./connection');
const { User, Item, Tag, Review } = require('../models');

db.once('open', async () => {
    await User.deleteMany();

    const users = await User.insertMany([
        {
            firstName: 'Brad',
            lastName: 'Wagner',
            email: 'brad@wagner.com',
            password: 'bradwagner',
            admin: true
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

    await Item.deleteMany();

    const items = await Item.insertMany([
        {
            name: 'Tenuta San Guido Sassicaia Bolgheri',
            description: 'World Class Dry Red Wine. Made from a blend of French groups and made in Italy, this wine is both strong and bold. It is sure to impress and slate the thirst of the dry red wine enthusiast!',
            image: 'pacific-rim-sweet-riesling.jpg',
            price: 58.99,
            tags: [
                tags[0]._id, tags[3]._id
            ],
            reviews: [ reviews[0]._id ] 
        },
        {
            name: 'Quinta Das Carvalhas Ruby Port Reserva',
            description: 'A sweet red wine, medium-bodied and made in Portugal. This port goes great with dessert and boasts an ABV of 20%, the perfert strength and pairing for anyone to make your grape-escape!',
            image: 'pacific-rim-sweet-riesling.jpg',
            price: 41.99,
            tags: [
                tags[0]._id, tags[4]._id, tags[6]._id
            ],
            reviews: [ reviews[1]._id ]
        },
        {
            name: 'Apothic Rosé',
            description: 'This refreshing rosé from California has become very popular thanks to its light-bodied flavor of raspberry and strawberry. Easy on the wallet, this rosé and blush wine is the perfect choice for that easy evening get away!',
            image: 'pacific-rim-sweet-riesling.jpg',
            price: 8.97,
            tags: [
                tags[2]._id, tags[5]._id
            ],
            reviews: [ reviews[2, 3]._id ]
        },
        {
            name: 'Florio Dry Marsala',
            description: 'Great for both cooking and drinking, this dry white wine from the Sicilian sunbelt boasts hints of raisins and vanilla. It is a fortified wine meaning that even if the chicken marsala lacks flavor, you will enjoy it as if from a michelin restaurant anyways!',
            image: 'pacific-rim-sweet-riesling.jpg',
            price: 14.99,
            tags: [
                tags[1]._id, tags[3]._id
            ],
            reviews: [ reviews[4]._id ]
        },
        {
            name: 'Pacific Rim Sweet Riesling',
            description: 'Straight from the Columbia Valley in the beautiful PNW, this white wine brings the flavors of pineapple, peach, and a touch of honey and finishes bright and crisp. Due to its low price and refreshing flavors, this riesling is in high demand. The perfect sipping for slipping away from the stress of the day!',
            image: 'pacific-rim-sweet-riesling.jpg',
            price: 8.99,
            tags: [
                tags[1]._id, tags[4]._id
            ],
            reviews: []
        }
    ]);

    console.log('Items seeded')

    process.exit();
})