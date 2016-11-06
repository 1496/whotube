var player, youtubeID;
var $message = null;
var socket = io();
var likeCount = 0;
var disLikeCount = 0;
/*------------------------------------------------
youtubeAPIの開始*/
var onYouTubePlayerAPIReady = function() {
  player = new YT.Player('player', {
    width: $(window).width(),
    height: $(window).height(),
    playerVars: {
        autoplay: 1,
        autohide:2,
        color:'#40BFB0',
        iv_load_policy:3,
        rel:0
    },
    events: {
      onReady:getNextYoutube,
      onStateChange: onPlayerStateChange
    }
  });

};


/*------------------------------------------------
youtubeIDの取得*/
var getNextYoutube = function() {
  console.log('getNextYoutube load....');
  $.ajax({
    type: "GET",
    url:'../api/get/'
  })
  .done(function(data){
    console.log(data);
    if (data || data.youtubeID !== undefined) {
      removeMessage();
      youtubeID = data;
      postPlaydFlag();
    } else {
      setTimeout(getNextYoutube, 5000);
      if($('#messageLayer').hasClass('on')) return false;
      showMessage('再生する動画がありません。<br>動画を遠慮無く投稿してください。<br>'/*+location.href.replace('player','')+'へアクセスして動画を投稿してください。'*/);
    }
  })
  .fail(function(){
    setTimeout(getNextYoutube, 5000);
  });
};

/*------------------------------------------------
動画のフラグを書き換えて動画の再生*/
var postPlaydFlag = function() {
  if (youtubeID) {
    $.ajax({
      type:'POST',
      url:'../api/played',
      data:{youtubeID: youtubeID}
    })
    .done(function(data){
      //動画を再生
      socket.emit('showNowPlayInfoByPlayer',data);
      console.log('emit showNowPlayInfoByPlayer',data);      

      setTimeout(function(){
        $('#player').css({opacity:1,transform:'scale(1)'});  
      },2000);
      
      player.loadVideoById(youtubeID);

      youtubeID = undefined;
      likeCount = 0;
      disLikeCount = 0;
    })
    .fail(function(){
      console.log('フラグの書き換え失敗');
    });
    $('iframe#id').css('height', $(window).height());


  } else {
    console.log('youtubeIDがない');
  }
};


/*------------------------------------------------
動画メッセージが0件の場合*/
var showMessage = function(str){
  $('#messageLayer').addClass('on');
  $('#messageLayer .text').html(str);
  socket.emit('hideNowPlayByPlayer');
};
var removeMessage = function(){
  $('#messageLayer').removeClass('on');
  $('#messageLayer .text').html('');
  socket.emit('showNowPlayByPlayer');
}


/*------------------------------------------------
動画が、終了した時*/
var onPlayerStateChange = function(e) {
  console.log(2);
  if (e.data === YT.PlayerState.ENDED) {
    getNextYoutube();
  }
}

/*------------------------------------------------
いいね*/
socket.on('pushLikeByServer',function(){
  likeCount ++;
  $('#like-layer').addClass('on');
  $('#like-layer .text span').html('☓' + likeCount);
  setTimeout(function(){$('#like-layer').removeClass('on')},1500);
});

/*------------------------------------------------
スキップ*/
socket.on('pushDisLikeByServer',function(){
  skipMovie();
});

var skipMovie = function(){

    disLikeCount ++;
    duration = 1 - disLikeCount * 0.2;    


  $('#player').css({opacity:duration,transform:'scale(' + duration + ')'});

  if(disLikeCount > 2)
  {
    $('#player').css({opacity:0,transform:'scale(' + 0 + ')'});
    getNextYoutube();  
  }
};











