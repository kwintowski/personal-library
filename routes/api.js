/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
var LibraryHandler = require('../controllers/libraryHandler.js');
const COLLECTION = "Book";

module.exports = function (app) {

  MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
    var db = client.db('myMongoDB');
  
    if(err) console.log('Database error: ' + err);
    
    console.log("New DB Connection");
    LibraryHandler = new LibraryHandler(app,db);
    console.log("New Library Handler");
    
    app.route('/api/books')
      .get(function (req, res){
        console.log("Got Here 2");
        
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        
      })

      .post(function (req, res){
        console.log("Got Here");
        var title = req.body.title;
        LibraryHandler.addBook(COLLECTION, title)
        .then((result)=>{console.log(result);res.json(result);})
        .catch((reject)=>{res.json(reject);}); 
        //response will contain new book object including atleast _id and title
      })

      .delete(function(req, res){
        //if successful response will be 'complete delete successful'
      });



    app.route('/api/books/:id')
      .get(function (req, res){
        var bookid = req.params.id;
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      })

      .post(function(req, res){
        var bookid = req.params.id;
        var comment = req.body.comment;
        //json res format same as .get
      })

      .delete(function(req, res){
        var bookid = req.params.id;
        //if successful response will be 'delete successful'
      });
  })
};
