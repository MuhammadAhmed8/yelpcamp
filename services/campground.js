const Campground = require("../models/campground");
const Reviews = require("../models/review");


exports.createCampground = async (campDetails) => {

    const campground = await Campground.create(campDetails);

    if(!campground){
        throw new ApiError(402, "Campground Not Created.")
    }

    return campground;

}

exports.getCampgrounds = async(filter, options) => {

    const totalResults = await Campground.count(filter);
    console.log(options.sortBy)
    const campgrounds = await Campground.find({...filter })
                                        .sort(options.sortBy || { '_id': -1 })
                                        .skip(options.skip)
                                        .limit(options.limit);

    const resultsFetched = campgrounds.length;

    return { totalResults, resultsFetched, campgrounds };
}

exports.findCampground = async (campId) => {

    const campground = await Campground.findById(campId).populate("author").populate({
        path: "reviews",
        populate: {
            path: 'author'
        }
    });
    
  
    if(!campground){
        throw new ApiError(404, "Campground Not Found.")
    }

    return campground;
}

exports.updateCampground = async(campId, updatedFields) => {

    if ('_id' in updatedFields) {
        delete updatedFields["_id"];
    }

    return await Campground.findOneAndUpdate({ _id: campId }, updatedFields, { new: true })

}


exports.deleteCampground = async(campId) => {
    await Campground.deleteOne({ _id: campId })
}

exports.calculateRatingAverage = async(campId) => {
    const ratingsAvgs =  await Reviews.aggregate([
        {
            $group: {
                 _id: "$campground",
                 ratingAvg: {
                   $avg: "$rating"
                }
              }
        }
    ])

    ratingsAvgs.forEach(async (r) => {
        await Campground.updateOne({_id: r._id}, {
            $set: {
                'ratingAvg': r.ratingAvg
            }
        })
    })

    console.log(ratingsAvgs);
}

exports.campgroundSortHandler = (sortBy)=>{

    if(sortBy === "recent"){
        return {
            _id: -1
        }
    }
    if(sortBy === "rating"){
        return {
            ratingAvg: -1
        }
    }
    if(sortBy === "price"){
        return {
            price: 1
        }
    }
}


