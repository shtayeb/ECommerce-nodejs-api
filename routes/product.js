const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Product = require("../models/Product");

// create product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  // const {name,price,image,description,category,quantity} = req.body;
  const product = new Product(req.body);
  try {
    const result = await product.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update the product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(500).json(updatedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete the Product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});
// Get the Product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Get all Product
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
