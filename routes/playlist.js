var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var VideoData = mongoose.model('Video');

/*================================================
mongo DB接続
================================================*/
mongoose.connect('mongodb://localhost/whotube',function(err){
  if(err){console.log(err+'dbfaild')}
  else
  {
      console.log('db sacsess(playlist)');
  }
});


/* GET users listing. */
router.get('/', function(req, res, next) {
	var list = [];
	// モデル名.find(検索条件,カラム指定(?),オプション, function(err, data){
	//     //ここに処理
	// });
	VideoData.find({played:true},{},{sort:{id: -1},limit:40},function(err,docs){
		if(err || docs === null){
			res.send(undefined);
			console.log(err,'get エラー');return false;
		}
		list = docs;
		res.render('playlist', { list:list });
	});

	
});

module.exports = router;
