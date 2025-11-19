const Cart = require("../models/cartmodel.js");
const Product = require("../models/product.js");
//Create New Item
const addToCart = async(req, res)=> {
    try{
        const{productId, quantity} = req.body;
        const userId = req.user._id; //from auth middleware

        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({message: "Product not found"});
        let cart = await Cart.findOne({user: userId});

        if(!cart)
        {
            //Create new Cart
            cart = new Cart({user: userId, items: [], totalPrice: 0});
        }
        const existingItem = cart.items.find((item)=> item.product.toString()===productId);
        if(existingItem){
            existingItem.quantity += quantity;
            existingItem.price = existingItem.quantity *product.sellingPrice
        }else{
            cart.items.push({
                product:productId,
                quantity,
                price:product.sellingPrice*quantity,
            });
        }
         cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);//Sums all product in the cart
          await cart.save();

          res.status(200).json(cart);
    } catch(err)  {
        res.status(500).json({message: err.message});
    }
};
//remove items from the cart
const removeFromCart = async(req, res)=>{
try{
    const userId = req.user._id;
    const {productId}= req.params;

    const cart = await Cart.findOne({user: userId });
    if(!cart) return res.status(404).json({message: "Cart not found"});

    cart.items = cart.items.filter(item =>item.product.toString()!==productId);
    cart.totalPrice =cart.items.reduce((sum, item)=>sum+ item.price,0);
    await cart.save();

  res.status(200).json(cart);
}catch (error) {
    res.status(500).json({ message: error.message });

}
};
//Update Quantity
const updateQuantity = async(req, res)=> {
    try{
        const {productId, quantity} = req.body;
        const userId = req.user._id;
        const cart = await Cart.findOne({
            user:userId
        });
        if(!cart)return res.status(404).json({message: "Cart not found"});
        const item = cart.items.find(item => item.product.toString()===productId);
        if (!item) return res.status(404).json({ message: "Item not found" });

          const product = await Product.findById(productId);
            item.quantity = quantity;
            item.price = product.sellingPrice * quantity;

          cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);
              await cart.save();

             res.status(200).json(cart);
   } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👀 Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToCart, removeFromCart, updateQuantity, getCart };