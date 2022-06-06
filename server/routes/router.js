const express = require("express");
const route = express.Router();

const services = require("../services/render");
const controller = require("../controller/controller");

route.get("/register", services.registration);
route.get("/", services.registration);
route.get("/login", services.login);
route.get("/main", services.main);
route.get("/main/profile", services.profile);
route.get("/main/profile/delete", services.delete_profile);
route.get("/main/profile/edit", services.edit_profile);
route.get("/main/profile/cart", services.cart);
route.post("/main/add_cart", services.add_cart);
route.get("/main/change_cart", services.change_cart);
route.get("/main/profile/cart/delete", services.delete_cart);
route.get("/main/profile/cart/buy_page", services.buy_page);
route.get("/main/profile/cart/buy", services.buy);
route.get("/admin/users", services.admin_users);
route.get("/admin/products", services.admin_prods);
route.get("/admin/add_prod", services.admin_add_prod);
route.get("/admin/edit_prod", services.admin_edit_prod);
route.get("/admin/delete_user", services.admin_delete_user);
route.get("/admin/delete_prod", services.admin_delete_prod);

route.post("/register", controller.registration);
route.post("/login", controller.login);
route.post("/api/admin_add_prod", controller.admin_add_prod);
route.get("/api/cart/delete", controller.delete_cart);
route.get("/api/cart", controller.user_cart);
route.get("/api/users", controller.send_users);
route.get("/api/products", controller.send_prods);
route.get("/api/add_cart", controller.add_cart);
route.get("/api/sum", controller.count_sum);
route.get("/api/cart/buy", controller.buy);
route.get("/api/delete_user", controller.delete_user);
route.get("/api/delete_prod", controller.delete_prod);
route.post("/api/admin_edit_prod", controller.admin_edit_prod);
route.post("/api/edit_profile", controller.edit_profile);

module.exports = route;