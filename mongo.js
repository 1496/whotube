module.exports = {
  db:{},
  collection:{},
  init:function(){
    console.log('読めてる');
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost:27017/whotube",function(err,db){
      if(err){return console.dir('エラー'+err);}
      console.log('接続できた');
      this.db = db;
      db.collection('video',function(err,collection){
    //
        this.collection = collection;
        // var docs = [
        //   {videoid:'dfdsf',played:0,fav:0,viewinfo:0,dislike:0,comment:[]}
        // ];
        // collection.insert(docs,function(err,result){
        //   if(err){return console.dir('mongoDB insert時'+err);}
        //   console.log(result);
        // });
      });
    });
  },
  insert:function(){
    console.log(this.collection);
    // var docs = [
    //   {videoid:'dfdsf',played:0,fav:0,viewinfo:0,dislike:0,comment:[]}
    // ];
    // this.collection.insert(docs,function(err,result){
    //   if(err){return console.dir('mongoDB insert時'+err);}
    //   console.log(result);
    // });
  }
};



/**/
