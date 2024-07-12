if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const listingRouter = require('./routes/listing.js')
const userRouter = require('./routes/user.js')
const reviewRouter = require('./routes/review.js')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.model.js')

const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
})
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err)
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,// 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")))
app.engine('ejs', ejsMate)

main().then(() => console.log("connected successfully"))
    .catch((err) => console.log(err))

async function main() {
    await mongoose.connect(process.env.ATLAS_URL)
}

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user
    next()
})

// app.get('/demouser', async (req, res) => {
//     let fakeuser = new User({
//         email: "abc@gmail.com",
//         username: "abc",
//     })
//     let registeredUser = await User.register(fakeuser, "helloworld")
//     res.send(registeredUser)
// })

app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

// app.get('/', (req, res) => {
//     res.send("im root")
// })

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err })
})

app.listen(1234, () => console.log("http://localhost:1234"))