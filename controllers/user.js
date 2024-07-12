const User = require('../models/user.model')

module.exports.renderSignUpForm = (req, res) => {
    res.render('users/signup.ejs')
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body
        let newUser = new User({ email, username })
        let registeredUser = await User.register(newUser, password)
        // console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Welcome to Wanderlust!")
            res.redirect('/listings')
        })
    }
    catch (error) {
        req.flash("error", error.message)
        res.redirect("/signup")
    }
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!")
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl)
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.logout = (req, res, err) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    })
}