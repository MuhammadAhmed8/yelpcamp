const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const options = {
    'toJSON': {
        'virtual': true
    }
};

const CampgroundSchema = new Schema({

    title: {
        type: String,
        // minlength: 6,
        maxlength: 30,
        required: true
    },

    images: [{
        url: String,
        filename: String 
    }],

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    price: {
        type:Number,
        min: 0,
    },

    description: {
        type: String,
        // minlength: 10,
        maxlength: 400
    },

    location: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reviews'
        }
    ],

    ratingAvg: {
        type: Number
    }

}, options);


module.exports = mongoose.model('Campground', CampgroundSchema);