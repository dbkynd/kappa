import MongoStore from 'connect-mongo';
import session from 'express-session';
import * as database from '../database';

export default session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: 'auto',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
  store: MongoStore.create({
    mongoUrl: database.getConnectionString(),
  }),
});
