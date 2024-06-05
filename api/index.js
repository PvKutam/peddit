const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const crypto = require("crypto");
const User = require("./model/user.model");
const Post = require("./model/Post.model");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const port = 3000;

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());``
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/test", (req, res) => {
  res.send("hello");
})


try {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected");
    })
    .catch((err) => {
      console.log(err);
    });
} catch (error) {
  console.log("error", err);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}.`);
});



app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileimage } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log("user already exist");
      return res.json({ message: "user already exist" }).status(400);
    }
    const newUser = await User.create({
      name,
      email,
      password,
      profileimage,
    });
    newUser.verificationToken = crypto.randomBytes(32).toString("hex");
    await newUser.save();
    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res
      .json({ message: "user created,Check your email for verification" })
      .status(200);
  } catch (error) {
    console.log(error);
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: "stockbox@gmail.com",
    to: email,
    subject: "Account Verification",
    text: `Click here to verify your account http://localhost:3000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("error sending verification email", error);
  }
};


app.get("/verify/:token", async (req, res) => {
    try {
      const token  = req.params.token;
        const user= await User.findOne({verificationToken:token})
        if (!user) {
            return res.status(404).json({message:"Invalid verification token"})
        }
        user.verfied= true;
        user.verificationToken= undefined
        await user.save()
        res.status(200).json({message:"user verified"})
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error})
    }
})

const generateKeySecret = () => {
 const secretkey= crypto.randomBytes(32).toString("hex");
 return secretkey
};

const Saltsecret = generateKeySecret()
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({message:"Please enter email and password"})
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"User not found"})
    }
    if(user.password !== password){
      return res.status(400).json({message:"Invalid password"})
    }
    const token= jwt.sign({id:user._id},Saltsecret)
    res.status(200).json({token})
    
  } catch (error) {
    let errorMessage = "Login Failed";
    if (error instanceof DatabaseConnectionError) {
      errorMessage = "Database connection issue";
    } else if (error instanceof ValidationError) {
      errorMessage = "Validation error";
    }
    return res.status(500).json({ message: errorMessage})
  }
})


