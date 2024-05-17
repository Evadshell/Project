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
import { ensureAuthenticated } from './middleware/authMiddleware.js';

import db from "./db.js";
const app = express();
app.use(
    session({
      secret: "Secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  );
  
app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true,

}));
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
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
  res.status(200).json({ message: "Login successful" });
});
// app.get('/login', ensureAuthenticated, (req, res) => {
//   res.send(`Hello, ${req.user.username}`);
// });
// Check if the user is authenticated
app.get('/login', async (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, return a success response with user information
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    // If the user is not authenticated, return a failure response
    res.status(401).json({ isAuthenticated: false, user: null });
  }
});

// app.get('/logout', (req, res,next) => {
//   req.logout(err => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect('/login');
//   });
// });
// app.get("/login")
// mongoose.connect(mongodbURL)
//         .then(()=>{
//             console.log("database is running");
            
//         })
//         .catch(error=>{
//             console.log(error);
//         })
        app.listen(PORT,()=>{
            console.log(`app is running at ${PORT}`);
        })