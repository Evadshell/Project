import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import multer from 'multer';
import {PORT,mongodbURL} from './config/config.js';
import cors from "cors";
import  Users  from "./models/User.js";
import initializePassport from "./config/passport_config.js";
// import { ensureAuthenticated } from './middleware/authMiddleware.js';
import MongoStore from "connect-mongo";
import path from 'path';

const app = express();

  
app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true,

}));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded bodies

app.use(session({
  secret: 'Secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: mongodbURL }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

// app.post('/login', passport.authenticate('local'), (req, res) => {
//   console.log("authenticated",req.body.who)
//   res.status(200).json({ message: "Login successful" , user:req.user });
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the folder to store the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|pdf/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images and PDFs Only!');
  }
}
app.get('/download/:id', async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user || !user.ID_Card) {
      return res.status(404).send('File not found');
    }

    const filePath = path.resolve(user.ID_Card);
    res.download(filePath);
  } catch (error) {
    res.status(500).send('Error downloading file: ' + error.message);
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
})
app.use("/uploads", express.static("uploads"));
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user,{session:true}, (err) => {
      if (err) return next(err);
      console.log("authenticated", req.body.who);
      return res.status(200).json({ message: "Login successful", user: req.user });
    });
  })(req, res, next);
});
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};
app.post("/register", upload.single("idCard"), async (req, res) => {
  const {
    username,
    password,
    name,
    age,
    dob,
    adharNo,
    contactNo,
    course,
    paymentStatus,
    franchise,
    Certificates,
  } = req.body;
  let idCard = req.file ? req.file.path : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      username,
      password: hashedPassword,
      personal_info: {
        name,
        age,
        DOB: dob,
        contact_no: contactNo,
        Adhaar_no: adharNo,
      },
      course,
      Payment_status: paymentStatus,
      Franchise: franchise,
      ID_Card: idCard,
      Certificates: Certificates,
    });

    await newUser.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(500).send("Error registering user: " + error.message);
  }
});

app.post('/update', upload.single("idCard"), async (req, res) => {
  const {
    _id,
    username,
    password,
    name,
    age,
    dob,
    adharNo,
    contactNo,
    course,
    paymentStatus,
    franchise,
  } = req.body;
  let idCard = req.file ? req.file.path : null;
console.log(idCard)
  try {
    let updateData = {
      username,
      'personal_info.name': name,
      'personal_info.age': age,
      'personal_info.DOB': dob,
      'personal_info.contact_no': contactNo,
      'personal_info.Adhaar_no': adharNo,
      course,
      Payment_status: paymentStatus,
      Franchise: franchise,
      ID_Card: idCard
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await Users.findByIdAndUpdate(_id, updateData, { new: true });
    res.status(200).send('User updated successfully');
  } catch (error) {
    res.status(500).send('Error updating user: ' + error.message);
  }
});
app.get('/home', ensureAuthenticated, (req, res) => {
  res.send('Welcome to the home page');
});
app.get("/deletestudent",async (req,res)=>{
  const id = req.body.selectedStudentId;
  try {
    const result = await Users.deleteOne({ id });
    console.log('User deleted:', result);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
})
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
app.get("/students",async (req,res)=>{
  const franchise = (req.user.center_name)
  const students = await Users.find({Franchise : franchise})
  // console.log(students)

  res.status(200).json({message:"students",students:students})
})
app.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    console.log("loggedin")
    res.status(200).json({ user: req.user });
  } else {
    console.log("notloggedin")
    res.status(401).json({ message: 'Not authenticated' });
  }
});
app.get("/studentdetail",async(req,res)=>{
  const id = req.query.id;
  console.log(id)
  const students = await Users.find({_id : id})
  res.status(200).json({message:"students",students:students})

})

        app.listen(PORT,()=>{
            console.log(`app is running at ${PORT}`);
        })