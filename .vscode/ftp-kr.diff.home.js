$(document).ready(function() {  
  gAjaxPost.init();
  gdLogout.init();
  
  gdEventTimer.init();
  gdEventTimer.startTimer(); 
  $("div.infoLeft").html("update this panel"); 
  console.log("loaded");
  initRightupRegion()
  initRightDownRegion()
});

/* div rightDown js start here */

function initRightDownRegion() {
  var sign = true
  // gdEventTimer.addEvent('getFriendList', '1', '.Friend')
  // gdEventTimer.startTimer()
  // $(".Friend").on('getFriendList', function () {
  //   lunxun()
  // })
  $(".test-getfl").on('click', function() {
      lunxun()
  })

  //gAjaxPost.chatRecord() //query chatrecord

  $('.Friend').on('mouseover', '.forclick', function(event) { //mouseover display personal information 
      //send msg
      for (var i = 0; i < gAjaxPost.personalInformation.length; i++)
          if ($(this).attr('id') == gAjaxPost.personalInformation[i]['userID']) {		 //get id
              $(this).attr('title', '账号' + ':' + gAjaxPost.personalInformation[i]['userID'] + '----' + 'userName' + ':' + gAjaxPost.personalInformation[i]['userName'])
          }
  })

  $('.Friend').on('click', '.forclick', function(event) {
    var name=$("this").html()
    $('#lc-policeName').html(name)
    var a=this
      popUpChatPage()
      gAjaxPost.chatRecord(a)
  })
  $("#sendMSG").click(function() {
      gAjaxPost.sendMsg()
  })
}

function popUpChatPage() {
  openChatPage()
  var offsetX = 0;
  var offsetY = 0;
  var bool = false;
  $("div#lc-chatPage").mousedown(function() {
      bool = true;
      offsetX = event.offsetX;
      offsetY = event.offsetY;
      $("#lc-close-chatPage").css('cursor', 'move');
  })
  $("div#lc-chatPage").mouseup(function() {
      bool = false;
  })
  $(document).mousemove(function(e) {
      if (!bool)
          return;
      var x = event.clientX - offsetX;
      var y = event.clientY - offsetY;
      $("div#lc-chatPage").css("left", x);
      $("div#lc-chatPage").css("top", y);
  })
}
function openChatPage() {
  $("#lc-chatPage").css({ "z-index": "2" })
}
function closeChatPage() {
  $("#lc-chatPage").css({ "z-index": "-2" })
}

function onclickOnlinePolice() {
  if ($('.forclick').is(':visible')) {
      $('.forclick').css({ "display": "none" })
  } else {
      $('.forclick').css({ "display": "block" })
  }
  //控制div的显示
}

function lunxun() {
  var url_1 = "jsonGateway.php"
  var jsondata = {
      "commonKey": "100",
      "appKey": "1",
      "sessionID": $('._gdData').data('session-id'),
      "data": {
          "senderID": $('._gdData').data('user-id')
      }
  }
  gAjaxPost.postOut(url_1, JSON.stringify(jsondata), $('.Friend'))
  $(".Friend").one("postResponse", function(event, response) {
      gAjaxPost.friendList(response, $(".Friend"))
  })
}

function lunxunChatData() {
  var jsondata = {
      "commonKey": "100",
      "appKey": "3",
      "sessionID": $('._gdData').data('session-id'),
      "data": {
          "senderID": $('._gdData').data('user-id'),
          "lastDialogID": gAjaxPost.lastDialogID
      }
  }
  gAjaxPost.postOut("jsonGateway.php", JSON.stringify(jsondata), $(".right")) //friendbox随便绑定的
  $(".file").one("postResponse", function(event, data) {
      var a = JSON.parse(data);
      console.log(a['appKey'] + "-------------------" + a['data'].length + "--------------")
      gAjaxPost.receiveChatData(data)
  })
}

/* div rightDown js end here */

/** added by lb ----start----- */
function initRightupRegion() {
  gAjaxPost.aysncPost = function(url, package, callback){
    var json={gdData:gAjaxPost.finalPack(package)};
    $.post(
      url,   // url
      json,                            // data
      function(response,status, xhr){                     // success, 
        callback(response)	  // return result by event postResponse
    });
  }
  gAjaxPost.aysncPostFormData = function(url, formData, callback){   // formData is FormData object
     $.ajax({
      url: url,
      type: "POST",
        processData: false, 
        contentType: false, 
      data: formData,
      success: function(response,status, xhr){
        callback(response)  // return result by event postResponse
      }
    });
  } // postFormData
  var RightUp = RightUp || {}
  window.RightUp = RightUp
  RightUp.rtmpBaseUrl = `rtmp://192.168.0.160/live/`
  var config = {
    flashplayer: "http://cdn.bdstatic.com/jwplayer/latest/cyberplayer.flash.swf",
    autostart: true,
    stretching: "uniform",
    volume: 100,
    controls: false,
    rtmp: {        
      reconnecttime: 5, // rtmp直播的重连次数
      bufferlength: 1 // 缓冲多少秒之后开始播放 默认1秒         
    },
    ak: "28c4f4cf125a461d81c76fa96d8b1422" // 公有云平台注册即可获得accessKey
  }
  RightUp.config = config;
  getOnlineUsers()
  setInterval('getOnlineUsers()', 30000)
}

function getOnlineUsers() {
  /* fake php request to get user data */
  /* var response = `{"appKey":"6","commonKey":"300","data":[{"userID":"8","fullName":"OKAladdin","sceneID":"v8","status":"2","beginTime":"2018-07-24 10:09:11"},{"userID":"15","fullName":"HansBill","sceneID":"v15","status":"3","beginTime":"2018-08-09 18:02:36"}],"sessionID":"sessionID","tag":"postTag_1534739519371","option":"","priority":0,"status":0,"errorMsg":"","timeStamp":"2018-08-20T04:31:59.371Z","arrivalTime":1534739541.356,"returnTime":1534739541.3651,"deviceIP":"192.168.0.21","extra":[]}`
  var users = JSON.parse(response).data;
  var mainUrl = getDefaultMainUrl(users)
  if (!RightUp.mainPlayer || RightUp.mainUrl != mainUrl) {
    RightUp.mainUrl = mainUrl;
    attachToMainPlayer()
  }
  maintainUserList(users) */
  var jsonPkg = {
    appKey: '6',
    commonKey: '300',
    data: {},
    sessionID: 'sessionID'
  }
  gAjaxPost.aysncPost('../../jsonGateway.php',JSON.stringify(jsonPkg), function(response){
    var users = JSON.parse(response).data;
    var mainUrl = getDefaultMainUrl(users)
    if (!RightUp.mainPlayer || RightUp.mainUrl != mainUrl) {
      RightUp.mainUrl = mainUrl;
      attachToMainPlayer()
    }
    maintainUserList(users)
    console.log(users)
  })
}

function maintainUserList(users) {
  var notPlaying = [];
  var availablePlayer = ['player0', 'player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7','player8']
  users.forEach(function (user, index) {
    if (user.sceneID) {
      var url = RightUp.rtmpBaseUrl + user.userID + 'AAA' + user.sceneID
      var index1 = whichPlaying(url)
      if (index1 < 0) {
        notPlaying.push(user)
      } else {
        availablePlayer.splice(availablePlayer.indexOf('player' + index), 1)
        updatePlayerStatus('player'+index, user.status)
      }
    }
  })
  if (availablePlayer.length > 0 && notPlaying.length > 0) {
    availablePlayer.forEach(function (player, index) {
      if(index < notPlaying.length) {
        updatePlayerStatus(player, notPlaying[index].status)
        if (notPlaying[index] && notPlaying[index].userID) {
          var url = RightUp.rtmpBaseUrl + notPlaying[index].userID + 'AAA' + notPlaying[index].sceneID
          var userName = notPlaying[index].fullName
          attachToSpecificPlayer(player, url, userName, notPlaying[index].status)
        }
      }
    })
  }
}

function updatePlayerStatus(player, status) {
  if(Number(status) == 2) {
    $('#'+player).parent().removeClass('warnning-border')
    $('#'+player).parent().addClass('alert-border')
  } else if(Number(status) == 3){
    $('#'+player).parent().removeClass('alert-border')
    $('#'+player).parent().addClass('warnning-border')
  } else {
    $('#'+player).parent().removeClass('alert-border')
    $('#'+player).parent().removeClass('warnning-border')
  }
  $('#'+player+'-send2main-btn').show()
}

function whichPlaying(url) {
  var index = -1;
  for (var i = 0; i < 4; i++) {
    var curPlayer = RightUp['player' + i]
    if (curPlayer && curPlayer.getPlaylistItem(0).file == url) {
      index = i;
    }
  }
  return index
}

function getDefaultMainUrl(users) {
  var params = getRequestParams();
  var mainUrl = RightUp.mainUrl;
 if(!mainUrl) {
   for (var i = 0; i < users.length; i++) {
     if (users[i].sceneID) {
       mainUrl = RightUp.rtmpBaseUrl + users[i].userID + 'AAA' + users[i].sceneID
       break
     }
   }
 }
  return params.mainUrl ? params.mainUrl : mainUrl; // 默认显示streamId=1的图像
}

function getRequestParams() {
  var url = location.search; //获取url中"?"符后的字串
  var params = {};
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return params;
}

function attachToMainPlayer() {
  var mainPlayerConfig = Object.assign({}, RightUp.config);
  mainPlayerConfig.file = RightUp.mainUrl
  mainPlayerConfig.controls = true
  mainPlayerConfig.width = '500px'
  mainPlayerConfig.height = '500px'
  if (RightUp.mainPlayer) {
    RightUp.mainPlayer.setup(mainPlayerConfig)
  } else {
    var player = cyberplayer("main-screen").setup(mainPlayerConfig)
    RightUp.mainPlayer = player
  }
}

function attachToSpecificPlayer(player, url, userName, status) {
  var basePlayerConfig = Object.assign({}, RightUp.config);
  basePlayerConfig.file = url;
  basePlayerConfig.width = '500px';
  basePlayerConfig.height = '500px'
  if (RightUp[player]) {
    RightUp[player].setup(basePlayerConfig)
  } else {
    var cplayer = cyberplayer(player).setup(basePlayerConfig)
    RightUp[player] = cplayer
  }
  $('#'+player+'-button').text(userName)
  // RightUp[player].onSeek(function(event){ 
  //   console.log('ready')
  //   // console.log($('#'+player/* + ' .jw-media' */)[0])
  //   $('#'+player)[0].bind('click',sendToMainScreen(1))
  // });
  RightUp[player].on('displayClick',function(){
    console.log('target')
    sendToMainScreen(player)
  })
  updatePlayerStatus(player, status)
}

function attachToPlayers() {
  var basePlayerConfig = Object.assign({}, RightUp.config);
  // RightUp.availablePlayers = []
  RightUp.users.forEach(function (user, index) {
    console.log(user)
    var file = RightUp.rtmpBaseUrl + user.userID + 'AAA' + user.sceneID
    basePlayerConfig.file = file
    if (RightUp[`player${index}`]) {
      RightUp[`player${index}`].setup(basePlayerConfig)
    } else {
      var player = cyberplayer(`player${index}`).setup(basePlayerConfig)
      RightUp[`player${index}`] = player
    }
    RightUp.availablePlayers.push({
      playerName: `player${index}`,
      playUrl: file
    })
  });
}

function sendToMainScreen(player) {
  console.log('click')
  try {
    var currentPlayer = RightUp[player];
    var currentUrl = currentPlayer.getPlaylistItem(0).file
    RightUp.mainUrl = currentUrl
    attachToMainPlayer()
  } catch (e) {
    console.error(e);
    alert('发生错误了!')
  }
}

function snapShot() {
  $.get('http://192.168.0.160:8000/api/snapshot', {
    url: RightUp.mainUrl
  }, function(response, status, xhr) {
    console.log(response)
    var baseUrl = 'http://192.168.0.160:8000/'
    var myImage = new Image();
    myImage.crossOrigin = "Anonymous";
    
    myImage.onload = function() {
      var imgWidth = myImage.width;
      var imgHeight = myImage.height;
      var $canvas = $('#canvasDemo')
      if($canvas.length == 0){
        $canvas = $(`<canvas id="canvasDemo" width="${imgWidth}" height="${imgHeight}"></canvas>`)
        $('#myModal .modal-body').append($canvas)        
      } else {
        $canvas.attr('width', imgWidth)
        $canvas.attr('height', imgHeight)
      }
      var sketchpad = new Sketchpad({
        element: '#canvasDemo',
        width: imgWidth,
        height: imgHeight,
      });
      sketchpad.color = '#BF0A10'
      var context = $('#canvasDemo')[0].getContext("2d");
      context.drawImage(myImage, 0, 0);
      $('#myModal .modal-content').width(imgWidth+50)
      $('.modal-dialog').css('margin-left', document.body.clientWidth/2 - imgWidth/2 -50)
      $('#myModal').modal('show')
    }
    myImage.src = baseUrl+response.imageUrl;
  })
}

function handleSubmit () {
  console.log('handleSubmit')
  canvas2blobPollyfill()
  var canvas = $('#canvasDemo')[0]
  canvas.toBlob(function(blob) {
    var userId = getMainScreenUserId()
    var senderId = '1' // 从登陆信息中取，todo
    var jsonPkg = {
      appKey: '4',
      commonKey: '100',
      data: {
        contentType: '3',
        receiverID: '5'/* userId */,
        senderID: senderId,
        msgType: '1'
      }
    }
    $("#formdataHelper input.gdData").val(JSON.stringify(jsonPkg));
    var fd = new FormData($('#formdataHelper')[0]);
    fd.append('mediaFile', blob, 'image.png')
    gAjaxPost.aysncPostFormData('../../jsonGateway.php', fd, function(res){
      console.log(res)
      $('#myModal').modal('hide')
    })
  });
}

function canvas2blobPollyfill () {
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
     value: function (callback, type, quality) {
   
       var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
           len = binStr.length,
           arr = new Uint8Array(len);
   
       for (var i=0; i<len; i++ ) {
        arr[i] = binStr.charCodeAt(i);
       }
   
       callback( new Blob( [arr], {type: type || 'image/png'} ) );
     }
    });
   }
}

function getMainScreenUserId() {
  var userId;
  if(RightUp.mainUrl){
    var urlArray = RightUp.mainUrl.split('/')
    return urlArray[urlArray.length-1].split('AAA')[0]
  }
  return 0
}

function zoomVideo(region) {
  console.log(region)
  var baseUrl = 'http://192.168.0.160:8000/'
  $.get('http://192.168.0.160:8000/api/zoom', {
    url: RightUp.mainUrl,
    region: region
  }, function(response, status, xhr) {
    console.log(response)
    if(!response.errormsg) {
      RightUp.mainUrl = RightUp.mainUrl.split('zoomhelper')[0]+'zoomhelper'
      attachToMainPlayer()
    }
  })
}

function resetZoom() {
  RightUp.mainUrl = RightUp.mainUrl.split('zoomhelper')[0]
  attachToMainPlayer()
}

/** added by lb ----start----- */