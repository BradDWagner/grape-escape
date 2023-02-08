const { AuthenticationError } = require('apollo-server-express');
const { User, Item, Order, Tag, Review } = require('../models');
const { signToken } = require('../utils/auth');
require('dotenv').config()
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
  Query: {
    tags: async () => {
      return await Tag.find()
    },
    items: async () => {
      return await Item.find().populate('tags').populate('reviews').populate({
        path: 'reviews',
        populate: { path: 'user', model: "User"}
      })
    },
    itemsByTag: async (parent, { tagId }) => {
      return await Item.find({
        tags: tagId
      }).populate('tags')
    },
    item: async (parent, { _id }) => {
      return await Item.findById(_id).populate('tags').populate('reviews').populate({
        path: 'reviews',
        populate: { path: 'user', model: "User" }
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
      console.log('order is')

      const { items } = await order.populate('items');

      for (let i = 0; i < items.length; i++) {
        const item = await stripe.products.create({
          name: items[i].name,
          description: items[i].description,
          images: [`${url}/images/${items[i].image}`]
        });

        const price = await stripe.prices.create({
          product: item.id,
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
      console.log(context.user);
      if (context.user) {
        const order = new Order({ items });

        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

        return order;
      }

      throw new AuthenticationError('Not logged in');
    },
    // updateUser: async (parent, args, context) => {
    //   if (context.user) {
    //     return await User.findByIdAndUpdate(context.user._id, args, { new: true });
    //   }

    //   throw new AuthenticationError('Not logged in');
    // },
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
    addComment: async (parent, { _id, comment }, context) => {
      console.log(context.user._id)
      if (context.user) {
        const newReview = await Review.create({ comment: comment, user: context.user._id })
        return await Item.findByIdAndUpdate(_id, { $push: { reviews: newReview } }, { new: true }).populate('reviews').populate({
          path: 'reviews',
          populate: { path: 'user', model: 'User' }
        });
      }

    },
    likeReview: async (parent, { _id }) => {
      return await Review.findByIdAndUpdate(_id, { $inc: { likes: 1 } }, { new: true }).poplulate('user')
    },
    addItem: async (parent, { name, description, price, tags }, context) => {
      let tagIds =[]
      if (tags.length) {
        const existingTags = await Tag.find();
        const existingTagNames = existingTags.map((tag) => tag.name);
        console.log(existingTagNames)
        for (i=0; i<tags.length; i++) {
          if (!existingTagNames.includes(tags[i])) {
            console.log(tags[i])
            const newTag = await Tag.create({name: tags[i]})
            tagIds.push(newTag._id)
          } else {
            const existingTagId = await Tag.findOne({name: tags[i]})
            tagIds.push(existingTagId._id)
          }
        }
      }

      const newItem = await (await Item.create({name: name, description: description, price: price, tags: tagIds})).populate('tags')
      console.log(newItem)
      return newItem
    }
  }
};

module.exports = resolvers;

