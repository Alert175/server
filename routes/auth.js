const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

/* Аутентификация */
router.post('/', (req, res)=>{
	const MongoClient = require("mongodb").MongoClient;
	const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
	mongoClient.connect(function(err, client){
		if(err){
				return console.log(err);
		}
		const db = client.db("dogma_db");
		const collection = db.collection("Users");
		collection.find({"_id": ObjectId("5d64d76389e09f3460254bb6")}).toArray(function(err, results){
			let login = results[0].login;
			let password = results[0].password;
			client.close();
			if(req.body.data.login == login && req.body.data.password == password){
				res.send("Successful");
			}
			else{
				res.send("Error");
			}
		});
	});
});
module.exports = router;