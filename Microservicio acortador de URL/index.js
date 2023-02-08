require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const dns = require('dns');
const urlparser= require('url');
// Basic Configuration
const port = process.env.PORT || 3005;



app.use(cors());
const connectionString = process.env.MONGO_URI;
console.log(connectionString);
mongoose.set("strictQuery", false);
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// esto hace que el servidor pueda recibir json

const urlSchema = new mongoose.Schema({
  url: String,
});

const Url = mongoose.model('Url', urlSchema);


app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint

app.post('/api/shorturl', (req, res) =>{
  const bodyurl = req.body.url;

  const something=dns.lookup(urlparser.parse(bodyurl).hostname
  ,(error,address) => {
    if(!address){
      res.json ({error: 'invalid url'})
    }else
    {
      const url = new Url({url: bodyurl});

      url.save((err, data) => {
        res.json({ 
          original_url: data.url,
          short_url: data._id})
      }) 
    }
    console.log("dns :", error);
    console.log("address :",address);

  });
 
  console.log(something);
 
  //res.json({ original_url: url , short_url: 1});
});
  
app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  Url.findById(id, (err, data) => {
    if(!data)
    {
      res.json({error: 'invalid url'})
    }else{
      res.redirect(data.url);
    }
  })
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
