const axios = require("axios");
resolve = require('path').resolve

exports.registration = (req, res) => {
    res.render("register");
}
exports.login = (req, res) => {
    res.render("login");
}
exports.main = (req, res) => {
    axios.get("http://localhost:3000/api/products")
        .then(function(response){
        res.locals.id = req.query.id;
        res.render("main", {prods:response.data})
    }).catch(err =>{
        res.send(err);
    })
}
exports.cart = async (req, res) => {
    await axios.get("http://localhost:3000/api/sum?id=" + req.query.id)
        .then(function(sum){
            res.locals.sum = sum.data;
        }).catch(err =>{
        res.send(err);
    })
    axios.get("http://localhost:3000/api/cart?id=" + req.query.id)
        .then(function(response){
            res.locals.id = req.query.id;
            res.render("cart", {user:response.data});
        }).catch(err =>{
        res.send(err);
    })
}
exports.add_cart = (req, res) => {
    axios.get("http://localhost:3000/api/add_cart?id=" + req.query.id + "&id2=" + req.query.id2)
        .then(function(response){
            res.redirect("/main?id=" + req.query.id);
    }).catch(err =>{
        res.send(err);
    })
}
exports.change_cart = (req, res) => {
    axios.get("http://localhost:3000/api/add_cart?id=" + req.query.id + "&id2=" + req.query.id2 + "&count=" + req.query.count)
        .then(function(response){
            res.redirect("/main/profile/cart?id=" + req.query.id);
        }).catch(err =>{
        res.send(err);
    })
}
exports.profile = (req, res) => {
    axios.get("http://localhost:3000/api/users?id=" + req.query.id)
        .then(function(response){
            res.locals.id = req.query.id;
            res.render("profile", {user:response.data});
        }).catch(err =>{
        res.send(err);
    })
}
exports.delete_cart = (req, res) => {
    axios.get("http://localhost:3000/api/cart/delete?id=" + req.query.id + "&id2=" + req.query.id2)
        .then(function(response){
            res.locals.id = req.query.id;
            res.redirect("/main/profile/cart?id=" + req.query.id)
        }).catch(err =>{
        res.send(err);
    })
}
exports.edit_profile = (req, res) => {
    axios.get("http://localhost:3000/api/users?id=" + req.query.id)
        .then(function(response){
            res.locals.id = req.query.id;
            res.render("edit_profile", {user:response.data});
        }).catch(err =>{
        res.send(err);
    })
}
exports.buy = (req, res) => {
    axios.get("http://localhost:3000/api/cart/delete?id=" + req.query.id)
        .then(function(response){
            res.locals.id = req.query.id;
            res.render("ups", {head: "Purchase confirmed", text: "Thanks for purchase!", link: "/main/profile/cart?id=" + req.query.id, linkText: "Return"});
            // res.render("buy", {user:response.data})
        }).catch(err =>{
        res.send(err);
    })
}
exports.buy_page = (req, res) => {
    axios.get("http://localhost:3000/api/sum?id=" + req.query.id)
        .then(function(sum){
            if(sum.data == 0){
                res.render("ups", {head: "No order", text: "Add products to cart", link: "/main/profile/cart?id=" + req.query.id, linkText: "Return"});
            }
            res.locals.sum = sum.data;
            res.locals.id = req.query.id;
            res.render("buy");
        }).catch(err => {
            res.send(err);
        })
}
exports.admin_users = (req, res) => {
    axios.get("http://localhost:3000/api/users")
        .then(function(response){
            res.locals.id = req.query.id;
            res.render("admin_users", {user:response.data});
        }).catch(err =>{
        res.send(err);
    })
}
exports.admin_prods = (req, res) => {
    axios.get("http://localhost:3000/api/products")
        .then(function(response){
            res.locals.id = req.query.id;
            res.render("admin_prods", {prods:response.data});
        }).catch(err =>{
        res.send(err);
    })
}
exports.admin_add_prod = (req, res) => {
    res.locals.id = req.query.id;
    res.render("admin_add_prod");
}
exports.admin_edit_prod = (req, res) => {
    axios.get("http://localhost:3000/api/products?id=" + req.query.id)
        .then(function(response){
            res.locals.id = req.query.id;
            res.locals.id2 = req.query.id2;
            res.render("admin_edit_prod", {prods:response.data});
        }).catch(err =>{
        res.send(err);
    })
}
exports.admin_delete_user = (req, res) => {
    axios.get("http://localhost:3000/api/delete_user?id=" + req.query.id)
        .then(function(response){
            res.locals.id = req.query.id2;
            res.redirect("/admin/users?id=" + req.query.id2);
        }).catch(err =>{
        res.send(err);
    })
}
exports.admin_delete_prod = (req, res) => {
    axios.get("http://localhost:3000/api/delete_prod?id=" + req.query.id)
        .then(function(response){
            res.locals.id = req.query.id2;
            res.redirect("/admin/products?id=" + req.query.id2);
        }).catch(err =>{
        res.send(err);
    })
}
exports.delete_profile = (req, res) => {
    axios.get("http://localhost:3000/api/delete_user?id=" + req.query.id)
        .then(function(response){
            res.redirect("/login");
        }).catch(err =>{
        res.send(err);
    })
}