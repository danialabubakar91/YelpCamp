require('dotenv').config();

const mongoose = require('mongoose');
const cities = require('./cities');
const extractedUrls = require('./extractedUrls');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const dbUrl = process.env.DB_URL;
//const localDbUrl = 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomImgNum = Math.floor(Math.random() * extractedUrls.length);
        const randomImgNum2 = Math.floor(Math.random() * extractedUrls.length);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6221e2d888a2cebb7a44326a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam vero porro minus, ipsa doloribus explicabo. Itaque molestias voluptates voluptatum beatae. Nostrum voluptate totam illo aut earum beatae sit dignissimos ullam.',
            price,
            geometry:{
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                // {
                //     url: 'https://res.cloudinary.com/diyym4wix/image/upload/v1646017742/YelpCamp/urex5ntv8dl1uhgjnkgv.jpg',
                //     filename: 'YelpCamp/urex5ntv8dl1uhgjnkgv'
                // },
                // {
                //     url: 'https://res.cloudinary.com/diyym4wix/image/upload/v1646017743/YelpCamp/bbieldnfnforblho2vhz.png',
                //     filename: 'YelpCamp/bbieldnfnforblho2vhz'
                // }
                {
                    url: extractedUrls[randomImgNum].url,
                    filename: extractedUrls[randomImgNum].filename
                },
                {
                    url: extractedUrls[randomImgNum2].url,
                    filename: extractedUrls[randomImgNum2].filename
                }
            ]
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})
