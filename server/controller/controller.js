let user_model = require("../model/user_model");
let prod_model = require("../model/prod_model");
const request = require("request");
const ObjectId = require('mongodb').ObjectId;
//const { parse } = require('node-html-parser');
function check(cart, id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].user == id) {
            return i;
        }
    }
    return -1;
}

exports.registration = (req, res) => {
    if(!req.body){
        res.render("ups", {head: "Oops...", text: "Content can not be empty", link: "/register", linkText: "Try again"});
        return;
    }
    let name = req.body.username;
    name = name.toLowerCase();
    let email = req.body.email;
    email = email.toLowerCase();
    let pass = req.body.password;
    let status = "user";

    if (pass.length < 7) {
        res.render("ups", {head: "Oops...", text: "Password less than 7 characters", link: "/register", linkText: "Try again"});
        return;
    }
    if (pass.toLowerCase() === pass){
        res.render("ups", {head: "Oops...", text: "Include capital letters in password", link: "/register", linkText: "Try again"});
        return;
    }
    if (pass.toUpperCase() === pass){
        res.render("ups", {head: "Oops...", text: "Include small letters in password", link: "/register", linkText: "Try again"});
        return;
    }
    for(let i = 0; i < pass.length; i++) {
        let char = pass[i].charCodeAt();
        if (char >= 32 && char <= 47 ||
            char >= 58 && char <= 64 ||
            char >= 91 && char <= 96 ||
            char >= 123 && char <= 126) {
            break;
        }
        if (i == pass.length - 1) {
            res.render("ups", {head: "Oops...", text: "Include special letters in password", link: "/register", linkText: "Try again"});
            return;
        }
    }
    user_model.findOne({name: name}, function(err, foundUser){
        if(foundUser){
            res.render("ups", {head: "Oops...", text: "Such nickname already registered", link: "/register", linkText: "Try again"});
            return;
        }
    })
    user_model.findOne({email: email}, function(err, foundUser){
        if(foundUser){
            res.render("ups", {head: "Oops...", text: "Such email already registered", link: "/register", linkText: "Try again"});
            return;
        }
    })
    if (email == "admin@admin.com"){
        status = "admin";
    }
    const user = new user_model({
        name:name,
        email:email,
        password:pass,
        status:status
    })
    user.save(function(err){
        if(err) {
            console.log(err);
        } else {
            res.render("ups", {head: "Success!", text: "Signed up successfully", link: "/login", linkText: "Login"});
            return;
        }
    });
}
exports.login = (req, res) => {
    if(!req.body){
        res.render("ups", {head: "Oops...", text: "Content can not be empty", link: "/login", linkText: "Try again"});
        return;
    }
    let email = req.body.email;
    email = email.toLowerCase();
    let password = req.body.password;

    user_model.findOne({email: email, password: password}, function(err, foundUser){
        if(foundUser){
            if(foundUser.status == "admin"){
                res.redirect("/admin/users?id=" + foundUser._id)
            }else{
                res.redirect("/main?id=" + foundUser._id)
                return;
            }
        }
        else{
            res.render("ups", {head: "Oops...", text: "Wrong email/password", link: "/login", linkText: "Try again"});
            return;
        }
    })
}
exports.send_prods = (req, res) =>{
    if(req.query.id){
        let id = req.query.id;
        prod_model.findById(id).then(prods => {
            res.send(prods);
        })
    }
    else{
        prod_model.find().then(prods => {
            res.send(prods);
        })
    }

}
exports.add_cart = (req, res) =>{
    let id = req.query.id;
    let prodId = req.query.id2;
    let count = 1;
    if(req.query.count){
        count = parseInt(req.query.count);
    }
    user_model.findOne({_id: id, cart: ObjectId(prodId)}, function(err, foundUser){
        if(!foundUser){
            prod_model.findById(prodId).then(data =>{
                if(data.stock <= 0){
                    res.send(data)
                }
                else{
                    prod_model.findByIdAndUpdate(prodId, {$push: {cart: {user: ObjectId(id), count: 1}}}).exec()
                    user_model.findByIdAndUpdate(id, {$push: {cart: ObjectId(prodId)}}).then(data =>{
                        res.send(data)
                    })
                }
            })
        }
        else{
            prod_model.findById(prodId).then(data =>{
                if(data.stock - data.cart[check(data.cart, id)].count <= 0 && count > 0){
                    res.send(data)
                }
                else{
                    prod_model.findOneAndUpdate({_id: prodId, "cart.user": ObjectId(id)}, {$inc: {"cart.$.count": count}}).then(data =>{
                        prod_model.findOne({_id: prodId, "cart.user": ObjectId(id), "cart.count": 0}, function(err, foundUser){
                            if(foundUser){
                                res.redirect("/main/profile/cart/delete?id=" + id + "&id2=" + prodId)
                            }
                            else{
                                res.send(data)
                            }
                        })
                    })
                }
            })
        }
    })
}
exports.send_users = (req, res) =>{
    if(req.query.id){
        let id = req.query.id;
        user_model.findById(id).then(user => {
            res.send(user);
        })
    }
    else{
        user_model.find().then(users => {
            res.send(users);
        })
    }
}
exports.user_cart = (req, res) =>{
    let id = req.query.id;
    user_model.aggregate([{$lookup: {from: "products", localField: "cart", foreignField: "_id", as: "cart"}}, {$match: {_id: ObjectId(id)}}])
        .then(user_cart => {
        res.send(user_cart);
    })
}
exports.delete_cart = (req, res) =>{
    if(req.query.id2){
        let id = req.query.id;
        let id2 = req.query.id2;
        user_model.findByIdAndUpdate(id, {$pull: {cart: ObjectId(id2)}}).exec()
        prod_model.findByIdAndUpdate(id2, {$pull: {cart: {user: ObjectId(id)}}}).then(data => {
            res.send(data);
        })
    }
    else{
        let id = req.query.id;
        let count;
        let prodId;
        user_model.findByIdAndUpdate(id, {$unset: {cart: ""}}).exec()
        prod_model.find({"cart.user": ObjectId(id)}).then(prods => {
            for(let i = 0; i < prods.length; i++){
                count = prods[i].cart[check(prods[i].cart, id)].count * -1;
                prodId = prods[i]._id;
                console.log(prodId);
                prod_model.findByIdAndUpdate(prodId, {$inc: {stock: count}}).exec();
            }
        })
        prod_model.updateMany({"cart.user": ObjectId(id)}, {$pull:{cart: {user: ObjectId(id)}}}).then(data =>{
            res.send(data);
        })
    }

}
exports.count_sum = (req, res) =>{
    let id = req.query.id;
    let sum = 0;
    prod_model.find().then(prods => {
        for(let i = 0; i < prods.length; i++){
            for(let i2 = 0; i2 < prods[i].cart.length; i2++){
                if(prods[i].cart[i2].user == id){
                    sum += prods[i].cart[i2].count * prods[i].cost
                    break;
                }
            }
        }
        console.log(sum);
        res.send(sum.toString());
    })
}

exports.buy = (req, res) =>{
    res.send("Success");
}
exports.admin_add_prod = (req, res) =>{
    let id = req.query.id;
    let name = req.body.name;
    let cost = req.body.cost;
    let stock = req.body.stock;
    const product = new prod_model({
        name:name,
        cost:cost,
        stock:stock
    })
    product.save(function(err){
        if(err) {
            console.log(err);
        } else {
            res.render("ups", {head: "Success!", text: "Product added successfully", link: "/admin/products?id=" + id, linkText: "Return"});
        }
    });
}
exports.admin_edit_prod = (req, res) =>{
    let id = req.query.id;
    let id2 = req.query.id2;
    let name = req.body.name;
    let cost = req.body.cost;
    let stock = req.body.stock;
    prod_model.findByIdAndUpdate(id, {name: name, cost: cost, stock: stock}).then(data =>{
        res.redirect("/admin/products?id=" + id2);
    })
}
exports.edit_profile = (req, res) =>{
    let id = req.query.id;
    let name = req.body.name;
    name = name.toLowerCase();
    let email = req.body.email;
    email = email.toLowerCase();
    let password = req.body.password;
    user_model.findOne({name: name, _id:{$ne: ObjectId(id)}}, function(err, foundUser){
        if(foundUser){
            res.render("ups", {head: "Oops...", text: "Such nickname already registered", link: "/main/profile?id=" + id, linkText: "Try again"});
        }
        else{
            user_model.findOne({email: email, _id:{$ne: ObjectId(id)}}, function(err, foundUser){
                if(foundUser){
                    res.render("ups", {head: "Oops...", text: "Such email already registered", link: "/main/profile?id=" + id, linkText: "Try again"});
                }
                else{
                    user_model.findByIdAndUpdate(id, {name: name, email: email, password: password}).then(data =>{
                        res.redirect("/main/profile?id=" + id);
                    })
                }
            })
        }
    })
}
exports.delete_user = (req, res) =>{
    let id = req.query.id;
    user_model.findById(id).then(data =>{
        for(let i = 0; i < data.cart.length; i++){
            prod_model.findByIdAndUpdate(data.cart[i], {$pull:{cart:{user:ObjectId(id)}}}).exec();
        }
        user_model.findByIdAndDelete(id).then(data =>{
            res.send(data);
        })
    })
}
exports.delete_prod = (req, res) =>{
    let id = req.query.id;
    prod_model.findById(id).then(data =>{
        for(let i = 0; i < data.cart.length; i++){
            user_model.findByIdAndUpdate(data.cart[i].user, {$pull:{cart:ObjectId(id)}}).exec();
        }
        prod_model.findByIdAndDelete(id).then(data =>{
            res.send(data);
        })
    })
}