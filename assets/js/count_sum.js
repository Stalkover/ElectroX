const user_model = require("../../server/model/user_model");
const {ObjectId} = require("mongodb");
exports.count_sum = (id) =>{
    user_model.aggregate([{$lookup: {from: "products", localField: "cart", foreignField: "_id", as: "cart"}},
        {$match: {_id: ObjectId(id)}}])
        .then(sum => {
            sum = sum.aggregate({$group: {_id:null, sum_val:{$sum:"$cart.cost"}}});
            console.log(sum);
            return sum;
        })
}