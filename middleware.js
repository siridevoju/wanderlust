const Listing = require('./models/listing.model')
const Review = require('./models/review.model')
const ExpressError = require('./utils/ExpressError.js')
const { listingSchema, reviewSchema } = require('./schema.js')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must be logged in to create listing")
        res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl //saving in locals
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let id = req.params.id
    let listing = await Listing.findById(id)
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "you are not the owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params
    let review = await Review.findById(reviewId)
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "you are not the author of this review")
        return res.redirect(`/listings/${id}`)
    }
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    }
    else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    }
    else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',')
        throw new ExpressError(400, msg)
    }
    else {
        next()
    }
}