const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if(req.body.path_upload_img){
			if(statPath(`../public/${req.body.path_upload_img}`) === false){
				const new_path = req.body.path_upload_img.split('/');
				let path_up = '../public/'
				for (const iterator of new_path) {
					if(statPath(`${path_up}`) === false){
						fs.mkdirSync(`${path_up}`);
						console.log(`создается каталог: ${path_up}`);
						path_up += `${iterator}/`;
					}
					else{
						if(statPath(`${path_up}/${iterator}`) === false){
							fs.mkdirSync(`${path_up}/${iterator}`);
							console.log(`создается: ${path_up} + ${iterator}`);
							path_up += `${iterator}/`;
						}
						else{
							path_up += `${iterator}/`;
						}
					}
				}
				cb(null, `../public/${req.body.path_upload_img}`);
			}
			else{
				cb(null, `../public/${req.body.path_upload_img}`);
			}
		}
		else{
			cb(null, '../public/')
		}
	},
	filename: function (req, file, cb) {
		cb(null, ObjectId() + file.originalname);
	}
})
const upload = multer({ storage: storage, limits:{fileSize: 1024*1024*10} });

const local_address = "http://45.67.57.52:3000";

/* проверка на существования нужного каталога */
function statPath(path) {
	try {
		fs.statSync(path);
		return true;
	} catch (ex) {}
	return false;
}

/* Получение инфорации об объекте */
router.get('/', function(req, res, next) {
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
			if(err){
					return console.log(err);
			}
			const db = client.db("dogma_db");
			const collection = db.collection("News");
			collection.find().toArray((err, results)=>{
				res.send(results);
				client.close();
		});
	});
});
/* Сохраняю новости */
router.post('/save_info',(req, res)=>{
	let result_array = [];
	try{
		for (const iterator of req.body.data.news) {
			const MongoClient = require("mongodb").MongoClient;
			const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
			mongoClient.connect(function(err, client){
				if(err){
						return console.log(err);
				}
				const db = client.db("dogma_db");
				const collection = db.collection("News");
				collection.findOneAndUpdate(
					{"_id": ObjectId(iterator._id)},
					{$set:{
						img_src: iterator.img_src,
						header: iterator.header,
						date: iterator.date,
						link: iterator.link,
						section: iterator.section
					}},
					{returnOriginal: false},
					function(err, result){
						if(err){
							console.log(err);
						}
						else{
							result_array.push(result);
						}
						client.close();
					}
				)
			});
		}
		res.sendStatus(200);
	}
	catch(err){
		res.sendStatus(500);
	}
});

/* Загрузка изображений */
router.post('/upload', upload.any(), (req, res)=>{
	if(req.body.path_db && req.body.id_db && req.body.path_upload_img){
		let db_path = req.body.path_db;
		let db_id = req.body.id_db;
		const MongoClient = require("mongodb").MongoClient;
		const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
		mongoClient.connect(function(err, client){
			if(err){
					return console.log(err);
			}
			const db = client.db("dogma_db");
			const collection = db.collection("News");
			collection.findOneAndUpdate(
				{"_id": ObjectId(db_id)},
				{$set:{
					[db_path]: `${local_address}/${req.body.path_upload_img}/${req.files[0].filename}`
				}},
				{returnOriginal: false},
				function(err, result){
					if(err){
						console.log(err);
					}
					else{
						res.send(result);
					}
					client.close();
				}
			)
		});
	}
	else{
		res.sendStatus(304);
		res.send('Не указаны все необходимые параметры')
	}
});

/* Добавление новости */
router.post('/create_news', (req, res)=>{
	const news = req.body.data.new_news;
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
		const db = client.db("dogma_db");
		const collection = db.collection("News");
		collection.insertOne(news, function(err, results){
			if(err){
				console.log(err)
				res.sendStatus(400);
			}
			else{
				res.send(results);
			}
			client.close();
		});
	});
});

/* Удаление новости */
router.post('/delete_news', (req, res)=>{
	const db_id = req.body.data.id;
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
		const db = client.db("dogma_db");
		const collection = db.collection("News");
		collection.deleteOne({"_id": ObjectId(db_id)}, function(err, results){
			if(err){
				console.log(err)
				res.sendStatus(400);
			}
			else{
				res.send(results);
			}
			client.close();
		});
	});
});

module.exports = router;