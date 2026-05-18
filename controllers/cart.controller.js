import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import { User } from "../models/UserModel.js";

export const createCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.id;
  try {
    const isValidUser = await User.findOne({ where: { id: userId } });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });

    const isValidProduct = await Product.findOne({ where: { id: productId } });
    if (!isValidProduct)
      return res.status(400).json({ message: "invalid product id" });

    if (quantity <= 0)
      return res.status(400).json({ message: "invalid quantity" });

    const totalPrice = isValidProduct.price * quantity;

    let cartItem;

    const ifUserHasSameProduct = await Cart.findOne({
      where: { userId, productId },
    });

    const aaa = await Cart.count({ where: { userId } });

    if (!ifUserHasSameProduct) {
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
        totalPrice,
      });
    } else {
      ifUserHasSameProduct.quantity += quantity;
      cartItem = await ifUserHasSameProduct.save();
    }

    return res.json({
      message: "product added to cart successfully",
      cartItem,
      koyDhoronerPonno: aaa,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error adding product to cart", error: error.message });
  }
};

export const getAllCarts = async (req, res) => {
  const userId = req.id;

  try {
    const isValidUser = await User.findOne({ where: { id: userId } });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });

    const { count, rows } = await Cart.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "productName",
            "price",
            "discount",
            "dicCountedPrice",
            "productImage",
            "slug",
          ],
        },
      ],
    });

    if (!count)
      return res
        .status(400)
        .json({ message: "your cart is empty... add something" });

    return res.json({
      message: "...",
      koyDhoronerPonno: count,
      carts: rows,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error getting all carts", error: error.message });
  }
};
// update from user cart

export const updateFromUserCart = async (req, res) => {
  const userId = req.id;
  const { userIdQuantityData } = req.body;

  try {
    const isValidUser = await User.findOne({ where: { id: userId } });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });

    const isValidUserIncart = await Cart.findAll({ where: { userId } });

    if (!isValidUserIncart || isValidUserIncart.length === 0)
      return res
        .status(400)
        .json({ message: "you have no any cart items in database" });

    // need to learn more about it
    await Promise.all(
      userIdQuantityData.map(async (cart) => {
        await Cart.update(
          { quantity: cart.quantity },
          {
            where: {
              userId,
              productId: cart.productId,
            },
          },
        );
      }),
    );

    return res.json({ message: "cart updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error updating your cart", error: error.message });
  }
};
// delete a cart
export const deleteCart = async (req, res) => {
  const userId = req.id;
  const { slug } = req.params;
  try {
    const isValidUser = await User.findOne({ where: { id: userId } });
    if (!isValidUser)
      return res.status(400).json({ message: "you are not a valid user" });

    const isValidSlug = await Product.findOne({
      where: { slug },
      attributes: ["id", "slug"],
    });
    if (!slug) return res.status(400).json({ message: "not a valid slug" });
    const findTheDeletedOne = await Cart.findOne({
      where: { productId: isValidSlug.id, userId },
    });
    await findTheDeletedOne.destroy();
    return res.status(200).json({ message: "cart items deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error deleting your cart", error: error.message });
  }
};
