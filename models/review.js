const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const options = {
    'toJSON': {
        'virtual': true
    }
};

const ReviewSchema = new Schema({

    content:{
        type: String
    },

    rating:{
        type: Number,
        min: 0,
        max: 5
    },

    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    campground:{
        type: Schema.Types.ObjectId,
        ref: 'Campground'
    }


}, options);


module.exports = mongoose.model('Reviews', ReviewSchema);