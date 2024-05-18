// passport-config.js
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';
import Users from '../models/User.js';

export default function initializePassport(passport) {


  // passport.use(
  //   new LocalStrategy(async (username, password, done) => {
  //     try {
  //       const user = await User.findOne({ username });
  //       if (!user) {
  //           console.log('Incorrect username')
  //         return done(null, false, { message: 'Incorrect username.' });
  //       }
  //       const isMatch = user.comparePassword(password);
  //       if (!isMatch) {
  //           console.log('Incorrect match')

  //         return done(null, false, { message: 'Incorrect password.' });
  //       }
  //       console.log('hogya')

  //       return done(null, user);
  //     } catch (err) {
  //       console.log("Database error:", err);

  //       return done(err);
  //     }
  //   })
  // );
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await Users.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'No user with that username' });
        }
        if (user.password !== password) { // Note: Never store passwords in plaintext
          return done(null, false, { message: 'Password incorrect' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Users.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });

  // passport.deserializeUser((user, cb) => {
  //   cb(null, user.id);
  // });
}
