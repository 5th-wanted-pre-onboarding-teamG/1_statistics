import * as session from 'express-session';
import * as passport from 'passport';

export const sessionConfig = (app) => {
  app.use(
    session({
      name: 'NEST_SESSION_ID',
      resave: false,
      saveUninitialized: true,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        maxAge: 60000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
