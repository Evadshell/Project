// passport-config.js
import { Strategy as LocalStrategy } from 'passport-local';
import Users from '../models/User.js';
import Franchise from '../models/Franchise.js';
import Admin from '../models/Admin.js';
import bcrypt from "bcrypt"
import db from '../db.js';
export default function initializePassport(passport) {

  passport.use(new LocalStrategy(
    { usernameField: 'username', passwordField: 'password', passReqToCallback: true },
        async (req,username, password, done) => {
          const { who } = req.body; 
      try {
        console.log(username,password,who)
        let user;
        if(who==="student"){
           user = await Users.findOne({ username });
        }else if(who==="franchise"){ user = await Franchise.findOne({ username });}
        else if (who==="admin"){user = await Admin.findOne({ username });}

        
        // const user1 = db.Students.findOne({username:username})
        if (user===null) {
          console.log("no")
          return done(null, false, { message: 'No user with that username' });
        }
        
          console.log(user.username,user.password)
          const valid = await bcrypt.compare(password, user.password);
          if (valid) {
            return done(null, user); // Password is correct, return the user
          } else {
            console.log("Password is incorrect");
            return done(null, false, { message: "Incorrect password" }); // Password is incorrect
          }
        
      } catch (err) {
        return done(err);
      }
    }
  ));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await Users.findById(id);
      if (!user) user = await Franchise.findById(id);
      if (!user) user = await Admin.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}