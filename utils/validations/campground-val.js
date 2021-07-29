const Joi = require('joi');

exports.createCampgroundVal = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string()
    }).required()
};

