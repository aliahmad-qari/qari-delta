const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
      location: joi.string().required(),
      country: joi.string().required(),
      category: joi
        .string()
        .valid(
          "Trending",
          "Rooms",
          "Iconic city",
          "Mountains",
          "Castles",
          "Beach",
          "Arctic",
          "Farms",
          "Nature",
          "Camping",
          "Dome",
          "Boat"
        )
        .required(),
      image: joi
        .object({
          url: joi.string().uri().allow(""),
          filename: joi.string().allow("", null),
        })
        .or("url", "filename"), // At least one must be present
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      comment: joi.string().required(), // Changed comments to string.

      rating: joi.number().required().min(1).max(5),

      createdAt: joi.date().required(),
    })
    .required(),
});
