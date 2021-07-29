const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Reviews = require("../models/review");
const Campgrounds = require("../models/campground");

exports.createReview = async ({content, rating, campgroundId, userId}) => {

    var review = await Reviews.findOne({campground: campgroundId, author: userId});
    
    if(review){
        throw new ApiError(404, "You have already given the review" );
    }
    
    review = await Reviews.create({
        content,
        rating,
        author: userId,
        campground: campgroundId
    })

    await Campgrounds.updateOne({_id: campgroundId}, {
        $push: {
            reviews: review._id
        }
    })

    if(!review){
        throw new ApiError(402, "Review not created");
    }

    return review;

}

exports.getReviewsByCampground = async (campgroundId, {limit, skip}) => {

    const reviews = await Reviews.find({campground: campgroundId})
                    .sort({_id: -1})
                    .skip(skip)
                    .limit(limit);

    return reviews;


}




