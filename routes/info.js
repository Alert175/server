const express = require('express');
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

router.get('/', function(req, res, next) {
	mongoClient.connect(function(err, client){
			if(err){
					return console.log(err);
			}
			const db = client.db("personDB");
			const collection = db.collection("person");
			collection.find().toArray(function(err, results){
				console.log(results);
				res.send(results);
				client.close();
		});
	});
});

module.exports = router;