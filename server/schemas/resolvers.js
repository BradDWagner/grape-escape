const { AuthenticationError } = require('apollo-server-express');
const { User, Item, Order, Tag, Review } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')(process.env.STRIPE_SERVER);

const resolvers = {
  Query: {
    tags: async () => {
      return await Tag.find()
    },
    items: async () => {
      return await Item.find().populate('tags')
    },
    itemsByTag: async (parent, { tagId }) => {
      return await Item.find({
        tags: tagId
      }).populate('tags')
    },
    item: async (parent, { _id }) => {
      return await Item.findById(_id).populate('tags').populate('reviews').populate({
        path: 'reviews',
        populate: { path: 'user' }
      });
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.items',
          populate: 'tags'
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    //   order: async (parent, { _id }, context) => {
    //     if (context.user) {
    //       const user = await User.findById(context.user._id).populate({
    //         path: 'orders.items',
    //         populate: 'tags'
    //       });

    //       return user.orders.id(_id);
    //     }

    //     throw new AuthenticationError('Not logged in');
    //   },
    checkout: async (parent, args, context) => {
      const url = new URL(context.headers.referer).origin;
      const order = new Order({ items: args.items });
      const line_items = [];

      const { items } = await order.populate('items');

      for (let i = 0; i < items.length; i++) {
        const item = await stripe.items.create({
          name: items[i].name,
          description: items[i].description,
          images: [`${url}/images/${items[i].image}`]
        });

        const price = await stripe.prices.create({
          item: item.id,
          unit_amount: items[i].price * 100,
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
    addOrder: async (parent, { items }, context) => {
      console.log(context);
      if (context.user) {
        const order = new Order({ items });

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
    addComment: async (parent, { _id, comment }, context) => {
      const newReview = await Review.create({ comment: comment, user: context.user._id })
      return await Item.findByIdAndUpdate(_id, { $push: { reviews: newReview } }, { new: true }).populate('reviews').populate({
        path: 'reviews',
        populate: { path: 'user' }
      });
    },
    likeReview: async (parent, { _id }) => {
      return await Review.findByIdAndUpdate(_id, { $inc: { likes: 1 } }, { new: true }).poplulate('user')
    },
    addItem: async (parent, args, context) => {
      if (context.user.admin) {
        const item = await Item.create(args)
        return item
      }

      throw new AuthenticationError('User does not have suffecient rights');
    }
  }
};

module.exports = resolvers;