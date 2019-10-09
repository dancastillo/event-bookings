const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds }})
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          creator: user.bind(this, event.creator)
        }
      })
    })
    .catch(err => {
      throw err;
    });
};

const user = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user.createdEvents)
      }
    })
    .catch(err => {
      throw err;
    })
};

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
      }
      
      type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
      }
      
      input UserInput {
        email: String!
        password: String!
      }
      
      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
          query: RootQuery 
          mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              return {
                ...event._doc,
                _id: event.id,
                creator: user.bind(this, event._doc.creator)
              };
            })
          })
          .catch(err => err);
      },
      createEvent: (args) => {

        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          /**
           * TODO remove hard coded creator
           */
          creator: '5d9d3a68584f1b0e61fcc06f'
        });

        let createdEvent;

        return event
          .save()
          .then(result => {
            createdEvent = {
              ...result._doc,
              _id: result._doc._id.toString(),
              creator: user.bind(this, result._doc.creator)
            };
            return User.findById('5d9d3a68584f1b0e61fcc06f');
          })
          .then(user => {
            if (!user) {
              throw new Error('User does not exist');
            }

            user.createdEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch(error => error);
      },
      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then(user => {
            if (user) {
              throw new Error('User exists already.');
            }

            return bcrypt.hash(args.userInput.password, 12)
          })
        .then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });

          return user.save();
        })
        .then(result => {
          return {
            ...result._doc,
            _id: result.id,
            password: null
          };
        })
        .catch(err => {
          throw err;
        });
      },
    },
    graphiql: true
  })
);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.DB_URI, options)
  .then(() => app.listen(3000))
  .catch(err => console.log(err));
