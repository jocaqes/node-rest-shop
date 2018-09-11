const mongoose = require('mongoose');

//esquema del producto
const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email:{type:String,
		required:true,
		unique:true,
		match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},//unique no verifica existencia previa, solo optimiza la verificacion
	password:{type:String,required:true}
});

//modelo del producto
module.exports = mongoose.model('User',userSchema);