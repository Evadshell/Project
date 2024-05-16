import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import multer from 'multer';
import cors from "cors";
const app = express();
const port = 5000;


app.listen(port,()=>{
    console.log(`app is running at ${port}`);
})