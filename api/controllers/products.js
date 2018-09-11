const mongoose = require('mongoose');
const Product = require ('../models/product');


exports.products_get_all = (req, res, next)=>{
	Product.find()
	.select('name price _id productImage')//lo que quiero recuperar
	.exec()
	.then(docs => {
		const response = {
			count:docs.length,
			products:docs.map(doc=>{
				return {
					name:doc.name,
					price:doc.price,
					productImage:doc.productImage,
					_id:doc._id,
					request:{
						type: 'GET',
						url:'http://localhost:3000/products/'+doc._id
					}
				}
			})
		};
		res.status(200).json(response);	
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error:err
		});
	});
}

exports.products_create_product = (req, res, next)=>{
	console.log(req.file);
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name:req.body.name,
		price:req.body.price,
		productImage:req.file.path
	});
	product
	.save()//guarda en la base de datos gracias a mongoose
	.then(result=>{//promesa
		console.log(result);
		res.status(201).json({
			message: 'Producto guardado con exito',
			createdProduct: {
				name:result.name,
				price:result.price,
				_id:result._id,
				request:{
					type: 'GET',
					url:'http://localhost:3000/products/'+result._id
				}
			}
		});
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({error:err});
	});//errores
	
}

exports.products_get_product = (req,res,next)=>{
	const id = req.params.productId;
	Product.findById(id)
	.select('name price _id productId')
	.exec()
	.then(doc=>{//promesa
		console.log('Desde base de datos',doc);
		if(doc)
		{
			res.status(200).json({
				product:doc,
				request:{
					type:'GET',
					url:'http://localhost:3000/products'
				}
			});
		}
		else
		{
			res.status(404).json({message: 'No hay producto bajo ese id'});
		}
		
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({error:err});
	});
}

exports.products_update_product = (req,res,next)=>{
	const id = req.params.productId;
	const updateOps = {};
	for(const ops of req.body)//se hace para verificar que campos se van a cambiar
	{
		updateOps[ops.propName]=ops.value;
	}
	Product.update({_id:id},{$set:updateOps})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Producto actualizado',
			request:{
				type:'GET',
				url:'http://localhost:3000/products/'+id
			}
		});
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});//y asi actualizamos solo los campos que provee el cliente
}

exports.products_delete = (req,res,next)=>{
	const id = req.params.productId;
	Product.remove({_id:id})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Producto eliminado',
			request:{
				type:'POST',
				url: 'http://localhost:3000/products',
				body:{name:'String',price:'Number'}
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}