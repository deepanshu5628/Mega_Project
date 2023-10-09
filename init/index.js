const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

main().then(() => console.log("connected to init db "))
    .catch((err) => console.log("err occured while connecting to init db"));


const initdb = async() => {
    await Listing.deleteMany();
    Listing.insertMany(initdata.data);
    console.log("sample data is sabed");
};

initdb();

// completed