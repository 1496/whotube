var socket = io();

(function(window, $) {
    var G = {};

    var youtubePass = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=AIzaSyDqonYpIKhpeZ1Zc7ozopQUErcrCo7cAcQ&q=";

    var $wrapper = $('.Wrapper');
    var $searchBox = $('.search-box');
    var $btSearch = $('.btn-search');
    var $list = $('.List ul');
    var $detailTitle = $('.detail-wrap .title');
    var $detailMovie = $('.detail-wrap .movie');
    var $detailBtn = $('.detail-wrap .btn-send');
    var $detailDescription = $('.detail-wrap .description');
    var $message = $('.message');
    var $nowPlay = $('.nowPlay');
    var $nowPlayText = $('.nowPlay .text span');
    var videoID = '';
    var videoTitle = '';

    G.init = function()
    {
      /*----------------------------
      イベントの設定
      */
      //検索ボタン
      $btSearch.on('tap',function(){
        G.getYoutubeData($searchBox.val(),G.viewYoutubeData);
      });

      //各動画をクリックした時
      $list.on('click','.items',function(){
        $list.find('.items').removeClass('active');
        $(this).addClass('active');
        G.viewMovieDetail($(this));
      });

      //動画詳細画面後の戻るボタン
      $('body').on('tap','.animated .search-wrap .bt-layer',function(e){
        e.stopPropagation();
        e.preventDefault();
        G.pageAnimationToggle();
      });

      //投稿する
      $detailBtn.on('tap',function(){
        G.pageAnimationToggle();
        setTimeout(function(){G.postVideoId($(this))},200);
      });

      //nowPlayInfo
      $nowPlay.on('tap',function(){
        G.showNowPlayInfo();
      });

      $nowPlay.find('.like').on('tap',function(){
        socket.emit('pushLikeByCliant');
      });

      $nowPlay.find('.dislike').on('tap',function(){
        socket.emit('pushDisLikeByCliant');
      });

    }


    /*----------------------------------------
    youtubeAPIにて情報を取得*/
    G.getYoutubeData = function(val,callBack)
    {
      $.ajax({
        url:youtubePass+val
      }).done(function(data){
        callBack(data);
      }).fail(function(data){
        alert('error!');
        return false;
      });

    };
    G.viewYoutubeData = function(data){
      $list.empty();
      $list.css({display:'none'});

      for(var i=0,len=data.items.length;i<len;i++)
      {
        // log(data.items[i]);
        var videoId = data.items[i].id.videoId;
        var description = data.items[i].snippet.description;
        var thumbnail = data.items[i].snippet.thumbnails.medium.url;
        var title = data.items[i].snippet.title;

        
        if(videoId === 'undefined' || videoId === undefined)
        {
          //videoIdがundifindの場合は配置しない
        }
        else
        {
          $list.append(
            $('<li class="items clearfix">')
            .attr({'data-videoId':videoId,'data-description':description,'data-title':title})
            .append(
              $('<p class="image inline-block-middle"></p>').append($('<img>').attr('src',thumbnail)),
              $('<p class="title inline-block-middle"></p>').html(title)
            )
          );
        }
      };
      $list.slideDown(100);
    };

    /*---------------------------------------------
    ページ遷移のアニメーション*/
    G.pageAnimationToggle = function()
    {
      if($wrapper.hasClass('animated'))
      {
          $wrapper.removeClass('animated');
      }
      else
      {
          $wrapper.addClass('animated');
      }
    };
    /*----------------------------------------
    ムービー詳細ページの内容の組み立て*/
    G.viewMovieDetail = function($this)
    {
      var scrollTop = getScrollTop();
      var titleStr = $this.find('.title').html();
      videoID = $this.data('videoid');
      videoTitle = $this.data('title');
      var description = $this.data('description');
      var youtubeUrl = "https://www.youtube.com/embed/" + videoID + "?showinfo=0";
      var $iframe = $('<iframe width="100%" frameborder="0"></iframe>')

      G.pageAnimationToggle();

      //タイトルの文字をセット
      $detailTitle.html(titleStr);
      $detailDescription.html(description);
      //動画をセット
      $iframe.attr('src',youtubeUrl);
      $detailMovie.empty().append($iframe);
    };
    /*--------------------------------
    投稿ボタンが押され、DBにvideoIDを渡す
    */
    G.postVideoId = function($this)
    {
      $.ajax({
        type:'POST',
        url:'/api/post',
        data:{youtubeID:videoID,title:videoTitle}
      }).done(function(data){
        G.viewModal(data);
      }).fail(function(data){

      });
    };
    /*--------------------------------
    書き込み完了したら処理
    */
    G.viewModal = function(videoID)
    {
      var imgPass = "http://img.youtube.com/vi/" + videoID + "/0.jpg";
      $('.success img').attr('src',imgPass);
      // $message.addClass('view').slideDown(500,'easeOutQuint');
      setTimeout(function(){
          $message.addClass('view');
      },50);

      setTimeout(function(){
        $message.removeClass('view');
      },2000);        
    };


    G.showNowPlayInfo = function()
    {

      if($nowPlay.hasClass('opend'))
      {
        $nowPlay.removeClass('opend');
        $nowPlay.find('.nowPlay-inner').slideUp();
        $nowPlay.find('.text i').addClass('fa-youtube-play').removeClass('fa-times');
        console.log($nowPlay.find('.text i'));
      }
      else
      {
        $nowPlay.addClass('opend'); 
        $nowPlay.find('.nowPlay-inner').slideDown();
        $nowPlay.find('.text i').removeClass('fa-youtube-play').addClass('fa-times');
        console.log($nowPlay.find('.text i'));
      }
      
    };

    /*==================================================
    socket.io
    ==================================================*/
    //現在再生されている動画の情報
    socket.on('pushNowPlayInfo_byServer',function(data){
      $nowPlayText.removeClass('animate').html(data.title);
      // $nowPlay.find('a').attr({'href':'https://www.youtube.com/watch?v='+ data.youtubeID +'/0.jpg','target':'_blank'});
      $nowPlay.find('img').attr({'src':'http://img.youtube.com/vi/'+ data.youtubeID +'/0.jpg'});
      console.log($nowPlay.find('img'));
      setTimeout(function(){
        $nowPlayText.addClass('animate'); 
      });
      
    });

    //再生情報隠す
    socket.on('hideNowPlayByServer',function(){
      $nowPlay.addClass('off');
    });
    //再生情報出す
    socket.on('showNowPlayByServer',function(){
      $nowPlay.removeClass('off');
    });



    window.search = G;

})(window, jQuery);




/* ↓ページのDOMがすべて生成されたら*/
jQuery(window).ready(function()
{
    search.init();
});

/* ↓ページすべての画像を読み込んだら
$(window).load(function()
{
     search.init();
});
*/


/*スクロールの値を取得*/
function getScrollTop(){ ///  verifica el calculo total en pixeles de toda la pagina
    if(typeof pageYOffset!= 'undefined')
    {
        $('#wirhe').text(pageYOffset);

        //most browsers
        return pageYOffset;
    }
    else
    {
        var B= document.body; //IE 'quirks'
        var D= document.documentElement; //IE with doctype
        D= (D.clientHeight)? D: B;
        $('#wirhe').text(D.scrollTop);
        return D.scrollTop;
    }
}

function log() {
    if(typeof console == "undefined") return;

    var args = jQuery.makeArray(arguments);
    console.log.apply(console, args);
}
