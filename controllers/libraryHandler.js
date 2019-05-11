    
'use strict';

var ObjectId = require('mongodb').ObjectID;

function LibraryHandler(app, db) {

  this.addBook = function(library, bookTitle) {
    
    return new Promise(function(resolve, reject){  
      db.collection(library).findAndModify(
        {title:bookTitle}, 
        {new:true},((err, doc) => {
        if(err) reject(err);
        resolve(doc);
      }));
    });
  }
}

module.exports = LibraryHandler;