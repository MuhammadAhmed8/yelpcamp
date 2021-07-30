const Joi = require("./extended-joi");

exports.createCampgroundVal = {
    body: Joi.object().keys({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required()
};

