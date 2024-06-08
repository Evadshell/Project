import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import multer from 'multer';
import {PORT,mongodbURL} from './config/config.js';
import Franchise from './models/Franchise.js';
import cors from "cors";
import  Users  from "./models/User.js";
import Admin from "./models/Admin.js";
import Test from "./models/Test.js";
import initializePassport from "./config/passport_config.js";
// import { ensureAuthenticated } from './middleware/authMiddleware.js';
import MongoStore from "connect-mongo";
import path from 'path';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

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


app.post('/addTest', async (req, res) => {
  const { testName, date, noOfQuestions, questions, duration, franchise } = req.body;

  try {
    const newTest = new Test({
      testName,
      date,
      noOfQuestions,
      questions,
      duration,
      franchise,
    });

    await newTest.save();
    res.status(201).json({ message: 'Test created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error: error.message });
  }
});
app.get('/getTests',async(req,res)=>{
  try {
    const test = await Test.find();
    if (!test) {
      return res.status(404).send('Test not found');
    }
    console.log(test)
    res.status(200).json({test:test});
  } catch (error) {
    res.status(500).send('Error fetching test: ' + error.message);
  } 
})
app.get('/getTest/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).send('Test not found');
    }
    res.status(200).json(test);
  } catch (error) {
    res.status(500).send('Error fetching test: ' + error.message);
  }
});
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
    const user = await Users.findById(req.params.id);//here a error is occuring see once
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
app.put("/franchise/:id", upload.single("center_image"), async (req, res) => {
  const { id } = req.params;
  const { center_name, address, director_name, contact, email } = req.body;
  const center_image = req.file ? req.file.path : null;

  try {
    const franchise = await Franchise.findById(id);
    if (!franchise) {
      return res.status(404).send("Franchise not found");
    }

    franchise.center_name = center_name;
    franchise.address = address;
    franchise.director_name = director_name;
    franchise.contact = contact;
    franchise.email = email;
    if (center_image) {
      franchise.center_image = center_image;
    }

    await franchise.save();
    res.status(200).send("Franchise updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating franchise: " + error.message);
  }
});
app.post('/notices', upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file ? req.file.path : null;

    const admin = await Admin.findOne(); // Assuming there's only one admin
    const newNotice = { text, image };
    admin.notices.push(newNotice);

    await admin.save();
    res.status(201).send('Notice added successfully');
  } catch (error) {
    res.status(500).send('Error adding notice: ' + error.message);
  }
});

app.get('/notices', async (req, res) => {
  try {
    const admin = await Admin.findOne(); // Assuming there's only one admin
    res.status(200).json({ notices: admin.notices });
  } catch (error) {
    res.status(500).send('Error fetching notices: ' + error.message);
  }
});

// app.delete('/notices/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const notice = await Notice.findByIdAndDelete(id);

//     if (!notice) {
//       return res.status(404).send({ message: 'Notice not found' });
//     }

//     res.status(200).send({ message: 'Notice deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting notice:', error);
//     res.status(500).send({ message: 'Internal server error' });
//   }
// });

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
    });

    await newUser.save();
    res.status(201).send("User registered");
  } catch (error) {
    console.log(error)
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

  try {
    // Create the base updateData object
    let updateData = {
      username,
      'personal_info.name': name,
      'personal_info.age': age,
      'personal_info.DOB': dob,
      'personal_info.contact_no': contactNo,
      'personal_info.Adhaar_no': adharNo,
      course,
      Payment_status: paymentStatus,
      Franchise: franchise
    };

    // If a new file is uploaded, add ID_Card to the updateData
    if (idCard) {
      updateData.ID_Card = idCard;
    }

    // If a password is provided, hash it and add to the updateData
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
app.post('/upload-certificates', upload.array('certificates', 10), async (req, res) => {
  const { studentId } = req.body;
  const certificates = req.files.map(file => file.path);

  try {
    const student = await Users.findById(studentId);
    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Append new certificates to the existing array
    student.Certificates = student.Certificates ? [...student.Certificates, ...certificates] : certificates;

    await student.save();
    res.status(200).send('Certificates uploaded successfully');
  } catch (error) {
    res.status(500).send('Error uploading certificates: ' + error.message);
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
app.get('/scores/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await Users.findById(userId).populate('testScores.testId', 'testName');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ testScores: user.testScores });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the test scores' });
  }
});
app.get('/previousScore/:userId/:testId', async (req, res) => {
  const { userId, testId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(testId)) {
    return res.status(400).json({ error: 'Invalid user or test ID' });
  }

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const previousScores = user.testScores.filter(score => score.testId.toString() === testId);
    if (previousScores.length > 0) {
      res.status(200).json({ previousScores });
    } else {
      res.status(404).json({ message: 'No previous scores found for this test' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the test scores' });
  }
});

app.post('/submitScore', async (req, res) => {
  const { userId, testId, score } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(testId)) {
    return res.status(400).json({ error: 'Invalid user or test ID' });
  }

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newScore = { testId, score };
    user.testScores.push(newScore);

    await user.save();
    res.status(200).json({ message: 'Test score submitted successfully', testScores: user.testScores });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while submitting the test score' });
  }
});
app.get('/franchises', async (req, res) => {
  try {
    const franchises = await Franchise.find();
    res.json({ franchises });
  } catch (error) {
    res.status(500).send('Error fetching franchises: ' + error.message);
  }
});

app.get('/franchise/:id', async (req, res) => {
  const id = req.params.id;

  try {
    let franchise;
    if (ObjectId.isValid(id)) {
      franchise = await Franchise.findById(id);
    } else {
      franchise = await Franchise.findOne({ center_name: id });
    }

    if (!franchise) {
      return res.status(404).send('Franchise not found');
    }

    res.status(200).json({ franchise });
  } catch (error) {
    res.status(500).send('Error fetching franchise: ' + error.message);
  }
});

app.post('/franchise', upload.single('center_image'), async (req, res) => {
  const {
    username,
    password,
    center_name,
    address,
    director_name,
    contact,
    email,
  } = req.body;
  const center_image = req.file ? req.file.path : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newFranchise = new Franchise({
      username,
      password: hashedPassword,
      center_name,
      address,
      director_name,
      center_image,
      contact,
      email,
      role: 'franchise',
    });

    await newFranchise.save();
    res.status(201).send('Franchise added');
  } catch (error) {
    res.status(500).send('Error adding franchise: ' + error.message);
  }
});
app.put('/franchise/:id', upload.single('center_image'), async (req, res) => {
  const id = req.params.id;
  const {
    username,
    password,
    center_name,
    address,
    director_name,
    contact,
    email,
  } = req.body;
  const center_image = req.file ? req.file.path : null;

  try {
    let updateData = {
      username,
      center_name,
      address,
      director_name,
      contact,
      email,
    };

    if (center_image) {
      updateData.center_image = center_image;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    let franchise;
    if (ObjectId.isValid(id)) {
      franchise = await Franchise.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      franchise = await Franchise.findOneAndUpdate({ center_name: id }, updateData, { new: true });
    }

    if (!franchise) {
      return res.status(404).send('Franchise not found');
    }

    res.status(200).send('Franchise updated');
  } catch (error) {
    res.status(500).send('Error updating franchise: ' + error.message);
  }
});

app.delete('/franchise/:id', async (req, res) => {
  try {
    await Franchise.findByIdAndDelete(req.params.id);
    res.status(200).send('Franchise deleted');
  } catch (error) {
    res.status(500).send('Error deleting franchise: ' + error.message);
  }
});



app.get("/students/:name",async (req,res)=>{
  const id = (req.params.name)
  console.log(id)
  var students;
  if(id)
    {
      students = await Users.find({Franchise : id})

    }
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