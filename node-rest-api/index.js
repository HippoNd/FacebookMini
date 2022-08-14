const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const multer = require("multer")
const path = require("path");
const MultipleFile = require("./models/MultipleFile");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

// app.use("/images", express.static(path.join(__dirname, "public/images")))

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/images", express.static(path.join(__dirname, "public/images")))

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage })
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("File uploaded successfully.")
//   } catch (err) {
//     console.log(err)
//   }
  
// }) 

//Multiple

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage })
app.post("/api/upload", upload.array("files"), (req, res) => {
  try {
    let filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
        }
        filesArray.push(file);
    });
    const multipleFiles = new MultipleFile({
        files: filesArray 
    });
     multipleFiles.save();
    return res.status(200).json("File uploaded successfully.")
  } catch (err) {
    console.log(err)
  }
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute); 
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute); 



app.listen(8800, () => {
  console.log("Backend server is running!");
});
