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

    app.route('/api/books')
    
      .get(function (req, res){
        MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
          var db = client.db('myMongoDB');

          if(err) console.log('Database error: ' + err);

          var libraryHandler = new LibraryHandler(app,db);
          libraryHandler.getBooks(COLLECTION)
          .then((result)=>{console.log(result);res.json(result);})
          .catch((reject)=>{res.json(reject);});          
        });
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        
      })

      .post(function (req, res){
      
        var title = req.body.title;
          
        MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
          var db = client.db('myMongoDB');

          if(err) console.log('Database error: ' + err);

          var libraryHandler = new LibraryHandler(app,db);
      
          libraryHandler.addBook(COLLECTION, title)
          .then((result)=>{console.log(result);res.json(result);})
          .catch((reject)=>{res.json(reject);}); 
          //response will contain new book object including atleast _id and title
        })
      })

      .delete(function(req, res){
        //if successful response will be 'complete delete successful'
        MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
          var db = client.db('myMongoDB');

          if(err) console.log('Database error: ' + err);

          var libraryHandler = new LibraryHandler(app,db);
          libraryHandler.deleteAll(COLLECTION)
          .then((result)=>{console.log(result);res.json(result);})
          .catch((reject)=>{res.json(reject);});          
        });
      });


    app.route('/api/books/:id')
      .get(function (req, res){
        var bookid = req.params.id;
        MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
          var db = client.db('myMongoDB');

          if(err) console.log('Database error: ' + err);

          var libraryHandler = new LibraryHandler(app,db);
          libraryHandler.getOneBook(COLLECTION,bookid)
          .then((result)=>{
            if(result=={}){
              res.json("no book exists");
            } else {
              res.json(result);
            }})
          .catch((reject)=>{res.json(reject);});          
        });
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      })

      .post(function(req, res){
      
        var bookid = req.params.id;
        var comment = req.body.comment;
      
        MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
          var db = client.db('myMongoDB');

          if(err) console.log('Database error: ' + err);

          var libraryHandler = new LibraryHandler(app,db);
          
          libraryHandler.addComment(COLLECTION, bookid, comment)
          .then((result)=>{console.log(result);res.json(result);})
          .catch((reject)=>{res.json(reject);}); 
        });
        //json res format same as .get
      })

      .delete(function(req, res){
        var bookid = req.params.id;
        //if successful response will be 'delete successful'
        MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
          var db = client.db('myMongoDB');

          if(err) console.log('Database error: ' + err);

          var libraryHandler = new LibraryHandler(app,db);
          libraryHandler.deleteBook(COLLECTION,bookid)
          .then((result)=>{console.log(result);res.json(result);})
          .catch((reject)=>{res.json(reject);});          
        });
      });
//  })
};
