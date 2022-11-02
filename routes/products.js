const express = require("express");
const router = express.Router();
const products = require("../data/products")

//get all products
router.get("/", (req,res) => {
    res.send(products)
})

//get product by id
router.get("/:id", (req,res) => {
    const product = products.find(item => item._id === req.params.id)
    if(product){
        res.send(product)
    } else {
        res.status(500).send('No Data found')
    }
})

module.exports = router;
