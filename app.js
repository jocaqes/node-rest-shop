const express = require('express');
const app = express();
const morgan = require('morgan');//only for debug/info purposes
const bodyParser = require('body-parser');
const mongoose = require('mongoose');//base de datos

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://jocaqes:'+process.env.MONGO_ATLAS_PW+'@grupo3db-shard-00-00-rv9r1.mongodb.net:27017,grupo3db-shard-00-01-rv9r1.mongodb.net:27017,grupo3db-shard-00-02-rv9r1.mongodb.net:27017/test?ssl=true&replicaSet=Grupo3DB-shard-0&authSource=admin&retryWrites=true',{
	useNewUrlParser:true
});

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//manejo de cors
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers',
		'Origin,X-Requested-With,Content-Type,Accept,Authorization');
	if(req.method === 'OPTIONS')
	{
		res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
		return res.status(200).json({});
	}
	next();
});

//rutas que deberian manejar las peticiones
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

//manejo de errores
app.use((req,res,next)=>{
	const error = new Error('No se encontro');
	error.status = 404;
	next(error);
});

app.use((error,req,res,next)=>{
	res.status(error.status || 500);
	res.json({
		error:{
			message:error.message
		}
	});
});

module.exports = app;