var express = require("express");
var cors = require("cors");
require("dotenv").config();
const  multer   =  require ( 'multer' ) 

var app = express();



app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse",multer().single('upfile') , (req, res) => {
  const { originalname: name, mimetype: type, size } = req.file;
  
  res.json({
    name: name,
    type: type,
    size: size

  })
});

const port = process.env.PORT || 3005;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
