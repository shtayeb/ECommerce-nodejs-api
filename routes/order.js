const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Order = require("../models/Order");

// create order
router.post("/", verifyToken, async (req, res) => {
  // const {name,price,image,description,category,quantity} = req.body;
  const order = new Order(req.body);
  try {
    const result = await order.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update the order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(500).json(updatedOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete the order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});
// Get user orders
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get monthly income
router.get("/monthly-income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: prevMonth,
          },
        },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
          sales: "$ammount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
