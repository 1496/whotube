var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var VideoData = mongoose.model('Video');
var nowPlayInfo = require('../nowPlayInfo.js');


/*================================================
mongo DB接続
================================================*/
mongoose.connect('mongodb://localhost/whotube',function(err){
  if(err){console.log(err+'dbfaild')}
  else
  {
      console.log('db sacsess');
  }
});


/*================================================
リモコンからの動画の投稿
================================================*/
router.post("/post/",function( req , res ,next){
  console.log('動画が投稿されました');

  videoData = new VideoData();
  videoData.youtubeID = req.body.youtubeID;
  videoData.title = req.body.title;
  // videoData.videoTitle = req.body.title;
  console.log(videoData.videoTitle,req.body.title);

  videoData.save(function(err){
    if(err){console.log(err,'postエラー');return false;}
    res.send(videoData.youtubeID);
  });

});

/*================================================
プレイヤーからyoutubeIDの取得
================================================*/
router.get("/get/",function(req,res){
  console.log('playerからyoutubeIDがリクエストされました');

  VideoData.findOne({played:false},function(err,docs){
    if(err || docs === null){
      res.send(undefined);
      console.log(err,'get エラー');return false;
    }
    res.send(docs.youtubeID);
  });
});


/*================================================
プレイヤーから動画再生済のフラグの書き換え
================================================*/
router.post("/played/",function(req,res){
  videoData = new VideoData();

  VideoData.findOne({youtubeID:req.body.youtubeID,played:false},function(err,docs){
    if(err || docs === null){console.log(err,'playedFlagエラー');return false;}

    docs.played = true;
    docs.save(function(err){
        if(err || docs === null){console.log(err,'updata');return false;}
        console.log('playerのフラグを書き換えました');
        res.send({title:docs.title,youtubeID:req.body.youtubeID});
    });

 });
});





module.exports = router;

































