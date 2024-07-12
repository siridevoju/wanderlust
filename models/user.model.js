const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    } //passportLocalMongoose automatically adds username with salting & hashing, password 
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)