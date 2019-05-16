    
'use strict';

var ObjectId = require('mongodb').ObjectID;

function LibraryHandler(app, db) {

  this.addBook = function(library, bookTitle) {
    
    return new Promise(function(resolve, reject){  
      db.collection(library).insertOne(
        {title:bookTitle, comments:[]},((err, doc) => {
        if(err) reject(err);
        resolve(doc.ops[0]);
      }));
    });
  }
  
  this.getBooks = function(library) {
    
    return new Promise(function(resolve, reject){  
      db.collection(library).aggregate([{$project:{title:1, numberOfComments: { $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "NA"} }
      }}]).toArray((err, doc) => {
        if(err) reject(err);
        resolve(doc);
      });
    });
  }  
  
  this.getOneBook = function(library, bookid) {
    
    return new Promise(function(resolve, reject){  
      db.collection(library).findOne({_id:ObjectId(bookid)},(err, doc) => {
        if(err) reject("no book exists");
        resolve(doc);
      });
    });
  } 
  
  this.addComment = function(library, bookid, comment) {
    
    return new Promise(function(resolve, reject){  
      db.collection(library).findOneAndUpdate(
        {_id:ObjectId(bookid)},
        {$push:{comments:comment}},
        {returnOriginal:false},((err, doc) => {
        if(err) reject(err);
        resolve(doc.value);
      }));
    });
  }
  
  this.deleteBook = function(library, bookid) {
    
    return new Promise(function(resolve, reject){    
      db.collection(library).findOneAndDelete({_id:ObjectId(bookid)}, (err, doc) => {
        if(err) reject("could not delete: " + bookid);
        resolve("delete successful");
      }
    )});
  }   
  
  this.deleteAll = function(library) {
    
    return new Promise(function(resolve, reject){    
      db.collection(library).deleteMany({}, (err, doc) => {
        if(err) reject("could not delete all");
        resolve("complete delete successful");
      }
    )});
  }   
}

module.exports = LibraryHandler;