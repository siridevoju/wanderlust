const mongoose = require('mongoose')
const initData = require('./data')
const Listing = require('../models/listing.model')

main().then(() => console.log("connected successfully"))
    .catch((err) => console.log(err))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

const initDB = async () => {
    await Listing.deleteMany({})
    // console.log(initData)
    initData.data = initData.map((obj) => ({ ...obj, owner: "668e2eea773e4ffa78beaa46" }))
    await Listing.insertMany(initData.data)
    console.log("data initialized")
}

initDB()