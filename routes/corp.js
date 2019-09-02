const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

/* Получение инфорации об объекте */
router.get('/commercial', function(req, res, next) {
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
			if(err){
					return console.log(err);
			}
			const db = client.db("dogma_db");
			const collection = db.collection("Commercial");
			collection.find().toArray((err, results)=>{
				res.send(results);
				client.close();
		});
	});
});

/* Получение информации по ЖК */
router.get('/cards_object', function(req, res, next) {
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
			if(err){
					return console.log(err);
			}
			const db = client.db("dogma_db");
			const collection = db.collection("live_object");
			collection.find().toArray((err, results)=>{
				res.send(results);
				client.close();
		});
	});
});

/* Получение всех новостей */
router.get('/news', function(req, res, next) {
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

/* Получение всех акций */
router.get('/stocks', function(req, res, next) {
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
			if(err){
					return console.log(err);
			}
			const db = client.db("dogma_db");
			const collection = db.collection("Stocks");
			collection.find().toArray((err, results)=>{
				res.send(results);
				client.close();
		});
	});
});

/* Получение всех отзывов */
router.get('/reviews', function(req, res, next) {
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

module.exports = router;