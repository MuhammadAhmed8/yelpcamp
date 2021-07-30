const express = require('express');
const router = express.Router();
const catchError = require("../utils/catchError");
const AuthService = require("../services/auth");
const ApiError = require("../utils/ApiError");
const validate = require("../middlewares/validate");
const {createCampgroundVal} = require("../utils/validations/campground-val");
const app = express();

//Require Logout
app.use((req,res,next)=>{
    if(req.session.user_id){
        const redirectUrl = '/campgrounds';
        return res.redirect(redirectUrl);
    }
    next();
})

// Render Login Page
router.get("/login", (req, res, next) => {

    res.render("auth/login");

})

// Render Signup Page
router.get("/register", (req, res, next) => {

    res.render("auth/register");
})

router.post("/login", catchError(async (req, res, next) => {


    const {email, password} = req.body;

    const user = await AuthService.loginUserByEmailAndPassword(email, password);

    if(user){
        req.session['user'] = user;
        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
    }
    else{
        return res.redirect("/login");
    }
    
    
}))


router.post("/register", catchError( async (req, res, next) => {

    const {email, password, name, location} = req.body;
    const user = await AuthService.registerUserByEmail({email, password, name, location});

    if(user){
        
        req.session.user = user;
        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
    
        return res.redirect(redirectUrl);
    }
    
    res.redirect("/register");
    
  
}))

router.post("/logout", (req,res,next)=>{
    req.session.user = null;
    req.session.destroy();

    res.redirect("/campgrounds");
})

module.exports = router;