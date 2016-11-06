/*--------------------------------
mogooseの処理
(スキーマの定義)
--------------------------------*/

/*
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var videoSchema = new Schema({
  youtubeID:{type:String},
  played:{type:Boolean,default:false},
  fav:{type:Number,default:0},
  dis:{type:Number,default:0},
  viewinfo:{type:Number,default:0},
  comment:{type:Array,default:[]},
  createTime:{type:Date,default:Date.now}
});
mongoose.model('VideoData',videoSchema);
*/

module.exports = function(){
	console.log('読み込まれている');
};