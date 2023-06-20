import { Router } from "express";
import customerModel from "./../models/customer.model.js";
import productModel from "./../models/product.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// create an instance of the express router
const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/cart", (req, res) => [res.render("cart")]);

router.post("/register", async (req, res) => {
  const customerInfo = req.body;

  //for Adding Product
  // try{
  //   await productModel = req.body;
      
//   res.status(200).json({ message: "Product added successfully" })
// } catch(error){
//   res.status(500).json({ message: error.message })
// }
  // 

   //;/product is a request parameter
  //Object ID

  try {
    await customerModel.create(customerInfo);

    res.cookie("userId", req.body.email);

    res.redirect("/products");
  } catch (error) {
    res.render("register", { error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASS
    ) {
      res.cookie("userId", email);
      res.cookie("super", 1);

      res.redirect("/products", { products, isAdmin: cookie.super });
    }

    const user = await customerModel.findOne({ email: email });

    if (user === null) {
      res.render("login", { error: "Invalid credentials" });
      return;
    }

    if (bcrypt.compareSync(password, user.password) === false) {
      res.render("login", { error: "Invalid credentials" });
      return;
    }

    res.cookie("userId", email);

    res.redirect("/products");
  } catch (error) {
    res.render("login", { error: error.message });
  }
});

router.get("/products", async (req, res) => {
  const cookie = req.cookies;

  // check if cookie is set
  if (cookie.userId == undefined) {
    res.redirect("/");
    return;
  }

  // check db
  if (typeof cookie.super == "undefined") {
    const userEmail = cookie.userId;

    const users = await customerModel.find({ email: userEmail });

    if (users.length === 0) {
      res.redirect("/");
      return;
    }
  }

  // fetch the products from the DB
  const products = await productModel.find({});

  res.render("products", { products });
});

// export router instance
export default router;

// products page, login, cart page, single product, logout
