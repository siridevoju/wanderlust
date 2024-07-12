const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const Listing = require('../models/listing.model')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')
const listingController = require("../controllers/listing.js")
const multer = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })

router.get('/', wrapAsync(listingController.index))
router.get('/new', isLoggedIn, listingController.renderNewForm)
router.post('/', isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing))
router.get('/:id', wrapAsync(listingController.showListing))
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))
router.put("/:id", isLoggedIn, isOwner, validateListing, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

module.exports = router