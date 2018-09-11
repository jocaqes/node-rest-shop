const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req,res,next)=>{
	User.find({email:req.body.email})
	.exec()
	.then(user=>{
		if(user.length>=1){//el usuario/mail ya existe
			return res.status(409).json({
				message:'El correo ya existe'
			});
		}
		else//si es un nuevo usuario
		{
			bcrypt.hash(req.body.password, 10,(err,hash)=>{//data,salt,callback
				if(err)//por ser asicrono no podemos guardar el password si no hay un hashing correcto
				{
					return res.status(500).json({error:err});
				}
				else
				{
					const user = new User({
						_id:new mongoose.Types.ObjectId(),
						email:req.body.email,
						password: hash
					});
					user.save()//guardamos en la base de datos
					.then(result=>{
						console.log(result);
						res.status(201).json({
							message:'Usuario creado'
						});
					})
					.catch(err=>{
						console.log(err);
						res.status(500).json({
							error:err
						});
					});
				}
			});
		}
	});	
}

exports.user_login = (req,res,next)=>{
	User.findOne({email:req.body.email})
	.exec()
	.then(user=>{
		if(!user)//mail incorrecto
		{
			return res.status(401).json({
				message: 'Fallo en autorizacion'
			});
		}
		bcrypt.compare(req.body.password,user.password,(er,result)=>{
			if(er)//algun tipo de error
			{
				return res.status(401).json({
					message: 'Fallo en autorizacion'
				});
			}
			if(result)//contraseña y mail correctos
			{
				const token = jwt.sign(
				{
					email:user.email,
					userId:user._id
				},
				process.env.JWT_KEY,
				{
					expiresIn:"1h"
				}
				);
				return res.status(200).json({
					message: 'Autorizacion exitosa',
					token:token
				});
			}else//contraseña incorrecta
			{
				return res.status(401).json({
					message: 'Fallo en autorizacion'
				});	
			}
		});

	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error:err
		});
	});
}

exports.user_delete = (req,res,next)=>{
	User.remove({_id:req.params.userId})
	.exec()
	.then(result=>{
		res.status(200).json({
			message:'Usuario eliminado'
		});
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error:err
		});
	});
}