const { Schema, model } = require('mongoose')



const userLog = new Schema({
    username: { type: String, required: true },
    count: { type: Number, required: true },
    log:  {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

  const Log = model('Log', userLog)


  module.exports = Log

