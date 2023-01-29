const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Order, Tag, Review } = require('../models');
// const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
    Query: {
        tags: async () => {
            return await Tag.find()
        },
        products: async () => {
            return await Product.find().populate('tags')
        },
        productsByTag: async (parent, { tagId }) => {
            return await Product.find({
                tags: tagId
            }).populate('tags')
        },
        product: async (parent, {_id}) => {
            return await Product.findById(_id).populate('tags').populate('reviews').populate({
                path: 'reviews',
                populate: { path: 'user'}
            });
        },
        user: async (parent, args, context) => {
            if (context.user) {
              const user = await User.findById(context.user._id).populate({
                path: 'orders.products',
                populate: 'tags'
              });
      
              user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);
      
              return user;
            }
      
            throw new AuthenticationError('Not logged in');
          },
          order: async (parent, { _id }, context) => {
            if (context.user) {
              const user = await User.findById(context.user._id).populate({
                path: 'orders.products',
                populate: 'tags'
              });
      
              return user.orders.id(_id);
            }
      
            throw new AuthenticationError('Not logged in');
          },
          checkout: async (parent, args, context) => {
            const url = new URL(context.headers.referer).origin;
            const order = new Order({ products: args.products });
            const line_items = [];
      
            const { products } = await order.populate('products');
      
            for (let i = 0; i < products.length; i++) {
              const product = await stripe.products.create({
                name: products[i].name,
                description: products[i].description,
                images: [`${url}/images/${products[i].image}`]
              });
      
              const price = await stripe.prices.create({
                product: product.id,
                unit_amount: products[i].price * 100,
                currency: 'usd',
              });
      
              line_items.push({
                price: price.id,
                quantity: 1
              });
            }
      
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items,
              mode: 'payment',
              success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${url}/`
            });
      
            return { session: session.id };
          }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
          },
          addOrder: async (parent, { products }, context) => {
            console.log(context);
            if (context.user) {
              const order = new Order({ products });
      
              await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });
      
              return order;
            }
      
            throw new AuthenticationError('Not logged in');
          },
          updateUser: async (parent, args, context) => {
            if (context.user) {
              return await User.findByIdAndUpdate(context.user._id, args, { new: true });
            }
      
            throw new AuthenticationError('Not logged in');
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },
          //TODO: double check context is working right
          addComment: async (parent, {_id, comment}, context) => {
            const newReview = await Review.create({ comment: comment, user: context.user._id})
            return await Product.findByIdAndUpdate(_id, { $push: {reviews: newReview}}, { new: true }).populate('reviews').populate({
                path: 'reviews',
                populate: { path: 'user'}
            });
          },
          likeReview: async (parent, {_id}) => {
            return await Review.findByIdAndUpdate(_id, { $inc: { likes: 1}}, { new: true }).poplulate('user')
          }
    }
};

module.exports = resolvers;