const { Schema, model } = require('mongoose')



const execiseSessionSchema = new Schema({
    description: { type: String, required: false },
    duration: { type: Number, required: false },
    date: { type: Date, required: false },
    userId : { type: String, required: false }
    
})
const Session = model('Session', execiseSessionSchema)


module.exports = Session




