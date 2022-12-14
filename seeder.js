//this script file is for importing data to the mongo db

const mongoose = require("mongoose");
const colors = require("colors");
const users = require("./data/users");      //sample data
const products = require("./data/products");  //sample data
const productOptions = require("./data/productOption");  //sample data
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Order = require("./models/orderModel");
const UserCart = require("./models/userCart");
const UserAddresses = require("./models/userAddresses");
const ProductOptionModel = require("./models/productOptionModel");
const connectDB = require("./config/db");

require("dotenv").config();

connectDB();

const importData = async () => {
    try {
        //clear db
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await UserCart.deleteMany();
        await UserAddresses.deleteMany();
        await ProductOptionModel.deleteMany();
        
        const createdUsers = await User.insertMany(users) //insert users to user table
        const createdProductOptions = await ProductOptionModel.insertMany(productOptions) //insert productOptions

        //iphone options
        // const iphoneOptions =  
        const adminUser = createdUsers.find(item => item.isAdmin === true);
        //add a user property to products data, set as admin's user info
        // const sampleProducts = products.map(product => {
        //     return { ...product, user: adminUser }
        // })
        const sampleProducts = products.map(item => {
            const optionExists = createdProductOptions.find(_item => _item.product_name === item.product_name)
            if(optionExists) return {...item, user: adminUser, productOptions: [optionExists]}
            return {...item, user: adminUser}}
        )


        await Product.insertMany(sampleProducts)    //insert products to product table

        // const iphoneProduct = createdProducts
        console.log("Data imported!".green.inverse)
    } catch(err) {
        console.log("Error: ".red.underline.bold, err.message)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        //clear db
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log("Data destroyed successfully!".green.inverse)
    } catch(err) {
        console.log("Error: ".red.underline.bold, err.message)
        process.exit(1)
    }
}

if(process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}

/**
 * 
 *      add these lines to package.json under 'scripts':
 *          "data:import": "node seeder.js",
 *           "data:destroy": "node seeder.js -d"
 *
 *      run this seeder file using terminal
 *      use command:
 *      npm run data:import       
 *      npm run data:destroy     
 */