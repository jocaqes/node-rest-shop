const mongoose = require('mongoose');

//esquema del producto
const productSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {type:String,required:true},
	price: {type:Number,required:true},
	productImage:{type:String,require:true}
});

//modelo del producto
module.exports = mongoose.model('Product',productSchema);