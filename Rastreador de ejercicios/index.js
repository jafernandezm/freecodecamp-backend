const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()

//modelos
const User = require('./models/users.js')
const Log = require('./models/log.js')
const Session = require('./models/exerciseSession.js')
//middleware

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const connectionString = process.env.MONGO_URI;

mongoose.set("strictQuery", false);
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


app.use(cors())
app.use(express.static('public'))
//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', (req, res) => {
   User.find({}, (err, data) => {
    if(err) {
      res.json({error: 'error'})
    } else {
      res.json(data)
    } 
  })
})


app.get('/api/users/:_id/logs', async (req, res) => {

  let {from, to, limit} = req.query
  // from es desde cuando
  // to es hasta cuando
  // limit es el limite de resultados
  console.log(limit)
  const userId = req.params._id
  const foundUser = await User.findById(userId)

  if(!foundUser)
    return res.json({error: 'user not found'})
  

  let filter={ userId: userId }
  let dateFilter = {}
  if (from) {
    dateFilter['$gte'] =new Date(from)
  }
  if (to) {
    dateFilter['$lte'] =new Date(to)
  }
  if (from || to) {
    filter.date = dateFilter
  }

  if (!limit) {
    limit = 100
  }
  console.log(limit) 

  let log = await Session.find(filter).limit(limit)
  log=
  log.map((session) => {
    return {
      description: session.description.toString(),
      duration: session.duration,
      date: session.date.toDateString()
    }
  }) 

  res.json({
    username: foundUser.username,
    count: log.length,
    _id: foundUser._id,
    log: log
  })
})

app.post('/api/users', (req, res) => {
  console.log(req.body)
  const username = req.body.username
  console.log(username)
  const newUser = new User({
    username: username
  })
  console.log(newUser)
  newUser.save((err, data) => {
    if(err) {
      res.json({error: 'username already taken'})
    } else {
      res.json({username: username, _id: data._id})
    }
  })
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id
  let {description, duration, date} = req.body
  
  if(!date) {
    date = new Date()
  }
  else {
    date = new Date(date)
  }
  User.findById(userId, (err, data) => {
    if(!data) {
      res.json({error: 'Unknown userId'})
    } else {
      const username = data.username
      let newSession = new Session({
        description: description,
        duration: duration,
        date: date,
        userId: userId
      })
      newSession.save((err, data) => {
        if(err) {
          res.json({error: 'error'})
        } else {
          res.json({
            username: username,
            description: data.description, 
            duration: +data.duration,
            _id: userId,
            date: new Date(data.date).toDateString()
          })
        } 
      })
    }



  })

})


/*
app.post("/api/users/:_id/exercises", (req, res) => {
  const { _id } = req.params
  const { description, duration, date } = req.body
  let fecha = new Date(date)
  let fechaVal = () => {
    if(fecha instanceof Date && !isNaN(fecha)){
      return fecha
    }
    else{
      fecha = new Date()
    }
  }
  User.findById(_id, (err, userData) => {
    fechaVal(fecha)
    if(err) console.log("Error .findById POST /api/users/:_id/exercises")
    const newExercise = new Session({
      description,
      duration,
      date: fecha,
      userId: userData._id
    })
    newExercise.save((err, exercise) => {
      if(err) console.log("Error .save() POST /api/users/:_id/exercises")
      res.json({
        username: userData.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString(),
        _id: userData._id
      })
    })    
  })
})
 
*/

const listener = app.listen(process.env.PORT || 3005, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
