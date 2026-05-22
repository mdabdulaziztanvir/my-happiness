import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";
import { OrderItems } from "../models/orderitems.js";
import { Product } from "../models/product.js";
import { User } from "../models/UserModel.js";

export const createOrder = async (req, res) => {
  const userId = req.id;
  const {
    shippingAddress,
    notes,
    shippingCost,
    total,
    discountTotal,
    afterDiscountTotal,
    grandTotal,
  } = req.body;
  try {
    const isValidUser = await User.findOne({
      where: { id: userId },
      attributes: ["id", "phoneNumber"],
      //   include: { model: Cart, as: "carts" },
    });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });

    // lets find the cart
    const findCart = await Cart.findAll({
      where: { userId },
      include: {
        model: Product,
        as: "product",
        attributes: ["id", "price", "dicCountedPrice"],
      },
    });
    if (!findCart || findCart.length === 0)
      return res
        .status(400)
        .json({ message: "you do not have cart, add some product" });

    // lets calculate prices

    const summary = findCart.reduce(
      (acc, cart) => {
        const singleProductTotal = cart.totalPrice * cart.quantity;

        const singlePRoductTotalDiscoundtedPrice =
          cart.product.dicCountedPrice * cart.quantity;
        const singleProductSavingTotal =
          singleProductTotal - singlePRoductTotalDiscoundtedPrice;

        acc.total += singleProductTotal;
        acc.afterDiscountTotal += singlePRoductTotalDiscoundtedPrice;
        acc.discountTotal += singleProductSavingTotal;
        return acc;
      },
      {
        total: 0,
        discountTotal: 0,
        afterDiscountTotal: 0,
      },
    );

    const toFixedTotal = Number(summary.total.toFixed(2));
    const toFixedAfterDiscountTotal = Number(
      summary.afterDiscountTotal.toFixed(2),
    );
    const toFixedDiscountTotal = Number(summary.discountTotal.toFixed(2));

    let backendShippingCost = 0;
    if (shippingCost === "Inside Dhaka") {
      backendShippingCost = 60;
    } else {
      backendShippingCost = 130;
    }

    const backendGrandTotal = afterDiscountTotal + backendShippingCost;
    // fixed acc

    const splittedShippingAddress = shippingAddress.split(" ")[0];

    const generateUniqueOrderId =
      "MHR" + Date.now() + userId + splittedShippingAddress;

    if (
      total !== toFixedTotal &&
      discountTotal !== toFixedDiscountTotal &&
      afterDiscountTotal !== toFixedAfterDiscountTotal &&
      grandTotal !== backendGrandTotal
    ) {
      return res
        .status(400)
        .json({ message: "you have send the value in vulnerable" });
    }
    const createOrder = await Order.create({
      userId,
      orderId: generateUniqueOrderId,
      shippingAddress,
      shippingCost: backendShippingCost,
      notes,

      paymentMethod: "cash_on_delivery",
      phoneNumber: isValidUser.phoneNumber,
      total: toFixedTotal,
      discountTotal: toFixedDiscountTotal,
      afterDiscountTotal: toFixedAfterDiscountTotal,
      grandTotal: backendGrandTotal,
    });

    const bulkCreateOrderItems = await OrderItems.bulkCreate(
      findCart.map((cart) => ({
        userId,
        productId: cart.productId,
        quantity: cart.quantity,
        orderId: generateUniqueOrderId,
        // calculation part
        total: cart.totalPrice,
        discountTotal: cart.totalPrice - cart.product.dicCountedPrice,
        afterDiscountTotal: cart.product.dicCountedPrice,
      })),
    );
    await Cart.destroy({ where: { userId } });

    return res.status(200).json({
      message: `Your order has been created. Collect the id: ${generateUniqueOrderId} to track it`,
      user: isValidUser,
      cart: findCart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error creating your order", error: error.message });
  }
};

// get all order according to user

export const gellAllOrderAccordingtoUser = async (req, res) => {
  const userId = req.id;
  try {
    const isValidUser = await User.findOne({ where: { id: userId } });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a vlaid user" });
    const allOrders = await Order.findAll({
      where: { userId },
      order: [["id", "DESC"]],
    });
    if (!allOrders)
      return res.status(400).json({ message: "you do not have any order.." });
    return res
      .status(200)
      .json({ message: "here is all your orders", orders: allOrders });
  } catch (error) {
    res.status(500).json({ message: "error getting you order" });
  }
};

// get single order by user
export const getSingleOrderByUser = async (req, res) => {
  const userId = req.id;
  const { orderId } = req.params;

  try {
    const isValidUser = await User.findOne({ where: { id: userId } });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a vlaid user" });

    const singleOrder = await Order.findOne({
      where: { userId, orderId },
    });
    if (!singleOrder)
      return res.status(400).json({ message: "you do not have any order.." });
    const orderItemsDb = await OrderItems.findAll({
      where: { orderId, userId },
    });

    return res.status(200).json({
      message: "here is your single order",
      order: singleOrder,
      items: orderItemsDb,
    });
  } catch (error) {
    res.status(500).json({ message: "error getting you order" });
  }
};

// admin
// get all order by admin
export const getAllOrder = async (req, res) => {
  const userId = req.id;
  try {
    const isValidUser = await User.findOne({
      where: { id: userId, adminValue: 1 },
    });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a admin" });
    const allOrders = await Order.findAll({ order: [["id", "DESC"]] });
    if (!allOrders)
      return res
        .status(400)
        .json({ message: "user does not do any order yet" });
    return res
      .status(200)
      .json({ message: "here is all your orders", order: allOrders });
  } catch (error) {
    res.status(500).json({ message: "error getting you order" });
  }
};

// get single ordr by admin
export const getSingleOrderByUserForAdmin = async (req, res) => {
  const userId = req.id;
  const orderId = req.params;
  try {
    const isValidUser = await User.findOne({
      where: { id: userId, adminValue: 1 },
    });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not an admin" });

    const singleOrder = await Order.findOne({ where: { orderId } });
    if (!singleOrder)
      return res.status(400).json({ message: "you do not have any order.." });

    return res
      .status(200)
      .json({ message: "here is your single order", order: singleOrder });
  } catch (error) {
    res.status(500).json({ message: "error getting you order" });
  }
};
