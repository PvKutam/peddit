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
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
``;
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/test", (req, res) => {
  res.send("hello");
});

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

app.listen(port, "0.0.0.0", () => {
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
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }
    user.verfied = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "user verified" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

const generateKeySecret = () => {
  const secretkey = crypto.randomBytes(32).toString("hex");
  return secretkey;
};

const Saltsecret = generateKeySecret();
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, Saltsecret);
    res.status(200).json({ token });
  } catch (error) {
    let errorMessage = "Login Failed";
    if (error instanceof DatabaseConnectionError) {
      errorMessage = "Database connection issue";
    } else if (error instanceof ValidationError) {
      errorMessage = "Validation error";
    }
    return res.status(500).json({ message: errorMessage });
  }
});

app.get("/profile/:userid", async (req, res) => {
  try {
    const userID = req.params.userid;
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error while getting profile", error);
    return res.status(500).json({ message: "Error while getting profile" });
  }
});

app.get("/users/:userid", async (req, res) => {
  try {
    const loggedInUserID = req.params.userid;

    // fetching user by id and populating the connections field
    const loggedInUser = await User.findById(loggedInUserID).populate(
      "connections",
      "_id"
    );
    if (!loggedInUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // finding the connected user ids
    const connectedUserid = loggedInUser.connections.map((connection) => {
      return connection._id;
    });
    //find the users who are not connected to the logged-in user id

    const users = await User.find({
      _id: { $ne: loggedInUserID, $nin: connectedUserid },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error while getting Users", error);
    return res.status(500).json({ message: "Error while getting Users" });
  }
});

app.post("/decode-token", (req, res) => {
  const token = req.body.token;
  // res.send(token)
  // Rest of the code...

  if (!token) {
    return res.status(400).send({ error: "Token is required" });
  }

  try {
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(400).send({ error: "Invalid token" });
    }
    res.send({ decoded });
  } catch (error) {
    res.status(500).send({ error: "Error decoding token" });
  }
});

app.post("/connection-req", async (req, res) => {
  try {
    const { currentUserID, selectedUserID } = req.body;
    await User.findByIdAndUpdate(selectedUserID, {
      $push: { connectionsrequests: currentUserID },
    });

    await User.findByIdAndUpdate(currentUserID, {
      $push: { sendconnectionrequests: selectedUserID },
    });

    return res.status(200);
  } catch (error) {
    console.log("Error sending Req", err);
    return res.status(500).json({ message: "Error sending Req" });
  }
});

app.get("/connection-req/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.findById(userid)
      .populate("connectionsrequests", "name email profileimage")
      .lean();

    const connectionRequests = user.connectionsrequests;
    res.json(connectionRequests);
  } catch (error) {
    console.log("Error getting connections", error);
    return res.status(500).json({ message: "Error getting connections" });
  }
});

app.post("/connection/accept", async (req, res) => {
  try {
    const { senderid, receiverid } = req.body;

    console.log(`Sender ID: ${senderid}, Receiver ID: ${receiverid}`);

    const sender = await User.findById(senderid);
    const receiver = await User.findById(receiverid);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    sender.connections.push(receiverid);
    receiver.connections.push(senderid);

    receiver.connectionsrequests = receiver.connectionsrequests.filter(
      (request) => request.toString() !== senderid.toString()
    );
    sender.sendconnectionrequests = sender.sendconnectionrequests.filter(
      (request) => request.toString() !== receiverid.toString()
    );

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Connection Accepted" });
  } catch (error) {
    console.log("Error sending Req", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/connectionList/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await User.findById(userid)
      .populate("connections", "name profileimage")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ Connection: user.connections });
  } catch (error) {
    console.log("Error while getting connection List", error);
    res.status(500).json({ message: "Error while getting connection List" });
  }
});

//create post
app.post("/createpost", async (req, res) => {
  try {
    const { description, imageUrl, userId } = req.body;
    console.log("Request body:", req.body);

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const newpost = new Post({
      description: description,
      imageurl: imageUrl,
      user: userId,
    });

    await newpost.save();

    res.status(201).json({ message: "post created", post: newpost });
  } catch (error) {
    console.log("error creating the post", error);
    res.status(500).json({ message: "error creating the post" });
  }
});

//fetch all post

app.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profileimage");
    res.status(200).json(posts);
  } catch (error) {
    console.log("error fetching all posts", error);
    res.status(500).json({ message: "Error fetching all posts" });
  }
});

app.post("/like/:postId/:userId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    //check if the user has already liked the post
    const existingLike = post?.likes.find(
      (like) => like.user.toString() === userId
    );

    if (existingLike) {
      post.likes = post.likes.filter((like) => like.user.toString() !== userId);
    } else {
      post.likes.push({ user: userId });
    }

    await post.save();

    res.status(200).json({ message: "Post like/unlike successfull", post });
  } catch (error) {
    console.log("error likeing a post", error);
    res.status(500).json({ message: "Error liking the post" });
  }
});

app.put("/profile/:userid",async(req,res)=>{
  try {
    const userid= req.params.userid;
    const {userDescription} = req.body;
    const user = await User.findByIdAndUpdate(userid,{userDescription});
    res.status(200).json({
      message:"User proflile updated successfully",
    })

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

  } catch (error) {
    console.log("Error while loading profile", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
})