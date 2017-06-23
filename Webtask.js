var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient;

var self = this;

/**
*	Main function executed on webtask service with nodeJS
**/
module.exports = function (ctx, done) {

	try {

		var origin = ctx.data.origin;

		//Verify where the request came from and execute appropriate process
		if ('github' === origin) {

			self.processGitHubRequest(ctx, function() {
				done(null, 'Success!');
			});

		} else if ('search' === origin) {

			self.searchGitHubRequest(ctx, function(result) {
				done(null, result);
			});

		} else {
			throw new Error('Origin parameter is requested !');
		}
		
		

	} catch(err) {
		done(err);
	} 

}

/**
*	Function designed to process all the context.
**/
self.processGitHubRequest = function(ctx, callBack) {
	var verification = self.verifySecretToken(ctx.data.SECRET, JSON.stringify(ctx.body), ctx.headers["x-hub-signature"]);
	if (verification) {
		
		var data = new Events(ctx.body.sender.login, ctx.body.action, 'github');
		self.saveMongoDB(ctx.data.MONGO_URL, 'events', data);		
		callBack();

	} else {
		throw new Error('Token sent is not expected !');
	}
}

/**
*	Function designed to search process result.
**/
self.searchGitHubRequest = function(ctx, callBack) {

	self.findAllMongoDB(ctx.data.MONGO_URL, 'events', function(result) {
		callBack(result);
	});

}

/**
*	Function to verify if the token sent by github on body match
*	with the secret sent on webtask.
**/
self.verifySecretToken = function(secret, text, token) {
    var hmac = crypto.createHmac("sha1", secret); // Creating HMAC cryptographic mechanism
    var calculatedSignature = "sha1=" + hmac.update(text).digest("hex"); // Creating token
    return (token === calculatedSignature); // Comparing token created by secret and token sent on request
}

/**
*	Function to save any collection on MongoDB
**/
self.saveMongoDB = function(url, collectionName, data) {
	MongoClient.connect(url, function(err, db) {

		var collection = db.collection(collectionName);

		collection.insertOne(data, function(err, result) {
			console.log("Inserted Event: "+data);
			db.close();
		});
	});
}

/**
*	Function to find all data of any collection on MongoDB
**/
self.findAllMongoDB = function(url, collectionName, callBack) {
	MongoClient.connect(url, function(err, db) {

		var collection = db.collection(collectionName);

		collection.find({}).toArray(function(err, docs) {
			if(err) throw err;

			callBack(docs);
		});
	});
}

/**********************************************************
*	Domains Models
**********************************************************/

var Events = function(user, event, from) {
	this.user = user;
	this.event = event;
	this.from = from;
	this.date = new Date();
}