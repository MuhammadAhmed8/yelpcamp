const express = require('express');
const router = express.Router();
const catchError = require("../utils/catchError");
const campgroundReviews = require("../services/campgroundReviews");
const ApiError = require("../utils/ApiError");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const app = express();


router.post("/campgrounds/:id/reviews", auth,  catchError(async (req,res, next) => {

    let params = {
        campgroundId: req.params.id,
        userId: req.user._id,
        content: req.body.content,
        rating: req.body.rating
    };

    const review = await campgroundReviews.createReview(params);
    req.flash("success", "Thank you for your review.");
    res.redirect(`/campgrounds/${req.params.id}`);

}))

router.get("/campgrounds/:id/reviews",catchError(async (req,res,next)=> {

    const options = {
        limit: req.query.limit || 10,
        skip: req.query.skip || 0
    };

    const reviews = await campgroundReviews.getReviewsByCampground(req.params.id, options);

    return res.json({reviews})
}))

module.exports = router;
