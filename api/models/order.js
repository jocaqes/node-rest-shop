const mongoose = require('mongoose');

//esquema del producto
const orderSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	product: {type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
	quantity:{type:Number,default:1}
});

//modelo del producto
module.exports = mongoose.model('Order',orderSchema);