const express = require('express');
const router = express.Router();
const catchError = require("../utils/catchError");
const CampgroundService = require("../services/campground");
const ApiError = require("../utils/ApiError");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const {createCampgroundVal} = require("../utils/validations/campground-val");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {pick,makeQueryString} = require("../utils/pick");
const multer = require('multer');
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// Get All Campgrounds 
router.get("/",catchError(async (req,res,next)=>{

    let filter = pick(req.query, ["title","location"]);

    let limit = +req.query.limit || 10;
    let page = +req.query.page || 1;
    let skip = +req.query.skip || (page-1)*limit;
    let sortBy = CampgroundService.campgroundSortHandler(req.query.sort);
    let queryString = makeQueryString(req.query);

    const campgrounds = await CampgroundService.getCampgrounds(filter, {limit, skip, sortBy});

    res.render('campgrounds/index', {...campgrounds, page, queryString } );
}))

// Create New Campground 
router.post("/",auth, upload.array('image'), validate(createCampgroundVal),async (req,res,next)=>{
    
    const {title, description, price, location} = req.body;
    
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send();

    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    const geometry = geoData.body.features[0].geometry;

    const campgroundData = {title, description, price, geometry, images};

    const newCampground = await CampgroundService.createCampground(campgroundData);

    return res.render('campgrounds/new');

})

// Get 'create campground' page
router.get("/new",auth, (req,res,next)=>{
    res.render("campgrounds/new")
})

// Get a specific campground by id
router.get("/:id", catchError( async (req,res,next)=>{

    const {id} = req.params;
    const campground = await CampgroundService.findCampground(id);
    
    res.render('campgrounds/show', {campground});
}))

// Update a specific campground
router.put("/:id",auth, (req,res,next)=>{

})

// Delete a specific campground
router.delete("/:id", (req,res,next)=>{

})


// Get 'edit campground' page
router.get("/:id/edit", (req,res,next)=>{

})





module.exports = router;