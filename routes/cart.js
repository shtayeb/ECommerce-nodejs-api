const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Cart = require("../models/Cart");

// create cart
router.post("/", verifyToken, async (req, res) => {
  // const {name,price,image,description,category,quantity} = req.body;
  const cart = new Cart(req.body);
  try {
    const result = await cart.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update the cart
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(500).json(updatedCart);
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete the cart
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});
// Get user cart
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId,
    });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
