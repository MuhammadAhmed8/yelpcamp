//Require login

const auth = (req, res, next) =>{
    if(!req.session.user){
        console.log("login kr pehlay")
        req.session.returnTo = req.originalUrl;
        return res.redirect("/auth/login");
    }
    req.user = req.session.user;
    res.locals.currentUser = req.user;
    next();
}

module.exports = auth;