const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

const local_address = "http://45.67.57.52:3000";

/* проверка на существования нужного каталога */
function statPath(path) {
	try {
		fs.statSync(path);
		return true;
	} catch (ex) {}
	return false;
}

/* Получение инфорации об отзывах */
router.get('/', function(req, res, next) {
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
			if(err){
					return console.log(err);
			}
			const db = client.db("dogma_db");
			const collection = db.collection("Reviews");
			collection.find().toArray((err, results)=>{
				res.send(results);
				client.close();
		});
	});
});

/* Сохраняю отзывы */
router.post('/save_reviews',(req, res)=>{
	let result_array = [];
	try{
		for (const iterator of req.body.data.reviews) {
			const MongoClient = require("mongodb").MongoClient;
			const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
			mongoClient.connect(function(err, client){
				if(err){
						return console.log(err);
				}
				const db = client.db("dogma_db");
				const collection = db.collection("Reviews");
				collection.findOneAndUpdate(
					{"_id": ObjectId(iterator._id)},
					{$set:{
						author: iterator.author,
						text: iterator.text,
						date: iterator.date,
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

/* Добавление отзыва */
router.post('/create_reviews', (req, res)=>{
	const reviews = req.body.data.new_reviews;
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
		const db = client.db("dogma_db");
		const collection = db.collection("Reviews");
		collection.insertOne(reviews, function(err, results){
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

/* Удаление отзыва */
router.post('/delete_reviews', (req, res)=>{
	const db_id = req.body.data.id;
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
		const db = client.db("dogma_db");
		const collection = db.collection("Reviews");
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