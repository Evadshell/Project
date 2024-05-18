import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import mongoose from "mongoose";
import multer from 'multer';
import {PORT,mongodbURL} from './config/config.js';
import cors from "cors";
import  Users  from "./models/User.js";
import UserRoute from "./routes/UserRoute.js"; // Correct import
import initializePassport from "./config/passport_config.js";
// import { ensureAuthenticated } from './middleware/authMiddleware.js';
import MongoStore from "connect-mongo";
import db from "./db.js";
const app = express();

  
app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true,

}));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: 'Secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: mongodbURL }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
// app.use('/login',UserRoute);
// app.post('/login', passport.authenticate('local', {
//   successRedirect: 'http://localhost:3000/',
//   failureRedirect: 'http://localhost:3000/login',
//   failureFlash: false,
// },(req,res)=>{
//   console.log("hehe");
// }));
// app.post('/login', passport.authenticate('local', {
//   successRedirect: 'http://localhost:3000/',
//   failureRedirect: 'http://localhost:3000/login',
//   failureFlash: false
// }), (req, res) => {
//   console.log("Login successful");
// });

app.post('/login', passport.authenticate('local'), (req, res) => {
  console.log("authenticated")
  res.status(200).json({ message: "Login successful" });
});
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const newUser = new Users({ username, password });
  await newUser.save();
  res.send('User registered');
});
// app.get("/login", async (req, res) => {
//   console.log("Checking authentication status");
//   if (req.isAuthenticated()) {
//     console.log("User is authenticated");
//     res.status(200).json({ isAuthenticated: true });
//   } else {
//     console.log("User is not authenticated");
//     res.status(401).json({ isAuthenticated: false, user: null });
//   }
// });
app.get('/home', ensureAuthenticated, (req, res) => {
  res.send('Welcome to the home page');
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid', { path: '/' });
      res.status(200).json({ message: 'Logged out' });
    });
  });
});


app.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


        app.listen(PORT,()=>{
            console.log(`app is running at ${PORT}`);
        })