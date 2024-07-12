const mongoose = require('mongoose')
const Review = require('./review.model')

const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: "String",
        filename: "String"
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        enum: ['mountains', 'arctic', 'farms', 'deserts'] //add more and add a dropdown in create listings, based on that build functionality
    }
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = mongoose.model('listing', listingSchema)

module.exports = Listing