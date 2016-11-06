/*================================================
Socket.io
================================================*/


exports.init = function (server) {
var io = require('socket.io').listen(server);
var nowPlayInfo = require('./nowPlayInfo.js');


io.sockets.on('connection',function(socket){
  socket.on('showNowPlayInfoByPlayer',function(data){
  	if(data === '')
  	{
  		socket.broadcast.emit('pushNowPlayInfo_byServer','現在投稿されている動画はありません');	
  	}
  	else
  	{
		  socket.broadcast.emit('pushNowPlayInfo_byServer',data);
  	}
  });

  socket.on('pushLikeByCliant',function(data){
    socket.broadcast.emit('pushLikeByServer');
  });
  socket.on('pushDisLikeByCliant',function(data){
    socket.broadcast.emit('pushDisLikeByServer');
  });

  socket.on('hideNowPlayByPlayer',function(){
    socket.broadcast.emit('hideNowPlayByServer');
    console.log('隠す');
  });
  socket.on('showNowPlayByPlayer',function(){
    socket.broadcast.emit('showNowPlayByServer');
    console.log('出す');
  });

  // socket.emit('pushToNowPlayID_byServer',youtubeID);
});


// io.sockets.on('connection',function(socket){
//   socket.on('clientToServer',function(data){


//     var changeQuestion = function()
//     {
//       if(share.quizNum < quizData.data.length - 1)
//       {
//         share.quizNum++;
//       }
//       else
//       {
//         share.quizNum = 0;
//       }
//     };
//     if(data ==="") return false;

//     //正解どうかを判定する
//     if(data === quizData.data[share.quizNum].answer)
//     {
//       changeQuestion();
//       socket.emit('serverToClientChageQuestion',quizData.data[share.quizNum].questions);
//     }
//     socket.emit('serverToClient',data);
//   });
// });

};
