$(document).ready(function () {
  gAjaxPost.init();
  gdLogout.init();

  gdEventTimer.init();
  gdEventTimer.startTimer();
  $("div.infoLeft").html("update this panel");
  console.log("loaded");
  initRightupRegion()
  initRightDownRegion()
  initialThisPartie();
  // zhang branch test
});

/* div rightDown js start here */
function initRightDownRegion() {
  gAjaxPost.personalInformation = null,
    gAjaxPost.lasttimeFriend = [],
    gAjaxPost.currFriend = [],
    // gAjaxPost.lastGroupID_userID = [],
    // gAjaxPost.currGroupID_userID = [],
    gAjaxPost.currGroupID = [],
    gAjaxPost.lasttimeGroupID = [],
    gAjaxPost.lasttime_selector = null,//event to remove
    gAjaxPost.curr_selector = null,//event to add and start
    gAjaxPost.lasttimeGroupMembers = [],
    gAjaxPost.currGroupMembers = [],
    gAjaxPost.lastDialogID = 0,    //上一次发过来的数据的最后的dialogID
    gAjaxPost.currChatFriendID = null,
    gAjaxPost.groupExistSign = true,
    gAjaxPost.Interval = null,
    //   gdEventTimer.addEvent('getFriendList', '1', '.Friend')
    // gdEventTimer.startTimer()
    $(".Friend").on('getFriendList', function () {
      lunxun()
    })
  $(".test-getfl").on('click', function () {
    //lunxun()
    //lunxunChatData()
    getGroupList()
  })
  //gAjaxPost.chatRecord() //query chatrecord

  $('.Friend').on('mouseover', '.forclick', function (event) { //mouseover display personal information 
    //send msg
    for (var i = 0; i < gAjaxPost.personalInformation.length; i++)
      if ($(this).attr('id') == gAjaxPost.personalInformation[i]['userID']) {		 //get id
        $(this).attr('title', '账号' + ':' + gAjaxPost.personalInformation[i]['userID'] + '----' + 'userName' + ':' + gAjaxPost.personalInformation[i]['userName'])
      }
  })

  $('.Friend').on('click', '.forclick', function (event) {
    var name = $(this).html()
    $('#lc-policeName').html(name)
    var a = this
    popUpChatPage()
    chatRecord(a)
  })
  $("button#lc-sendMsg").click(function () {
    sendMsg()
  })
  //listen groupclick event
  $("div.rightDown").on('click', 'div.lc-groupArea button.lc-groupclick', function () {
    // if (gAjaxPost.lasttime_selector.length == 0) {
    //   gdEventTimer.addEvent('getGroupMembers', '1', this)
    //   gdEventTimer.startTimer()
    // } else {
    //   //gAjaxPost.lasttimeGroupMembers.splice(0, gAjaxPost.lasttimeGroupMembers.length)
    //   gdEventTimer.stopTimer()
    //   gdEventTimer.removeEvent('getGroupMembers', '1', gAjaxPost.lasttime_selector)
    //   gdEventTimer.addEvent('getGroupMembers', '1', this)
    //   gdEventTimer.startTimer()
    // }
    // gdEventTimer.removeEvent('getGroupMembers', '1', gAjaxPost.lasttime_selector)
    // gdEventTimer.addEvent('getGroupMembers', '1', this)
    gAjaxPost.curr_selector = this
    console.log(gAjaxPost.lasttime_selector)
    
    if (gAjaxPost.lasttime_selector == null) {

      gAjaxPost.lasttimeGroupMembers.splice(0, gAjaxPost.lasttimeGroupMembers.length)   //获取新的群组时，应先清空和上一次相关的群成员ID
      // gAjaxPost.Interval=setInterval("ListenCurrGroupMembers("+gAjaxPost.lasttime_selector+")",1000);
      gAjaxPost.Interval = self.setInterval(function () {
        var ID = $(gAjaxPost.curr_selector).attr('id')
        groupID = ID.substr(11)
        var jsondata = {
          "commonKey": "403",
          "appKey": "8",
          "data": {
            "groupID": groupID
          }
        }
        gAjaxPost.aysncPost("../../jsonGateway.php", JSON.stringify(jsondata), function (response) {
          addGroupMembers(response, groupID)
        })
      }, 100);
      console.log("the first time set timer")
    } else if (gAjaxPost.lasttime_selector == gAjaxPost.curr_selector) {   //如果两次点击同一个群明，不设置新的定时器
      console.log("the same group")
    } else {
      window.clearInterval(gAjaxPost.Interval)
      var parentNode = $(gAjaxPost.lasttime_selector).parent()
      var content = $(gAjaxPost.lasttime_selector).html()
      var id = $(gAjaxPost.lasttime_selector).attr('id')
      // console.log(id)
      // console.log(parentNode)
      parentNode.html("")
      console.log(parentNode.html())

      console.log("0903 set timer when two click diff")
      parentNode.append('<button class="lc-groupclick" id=' + '"' + id + '"' + '>' + content + '</button>')
      gAjaxPost.lasttimeGroupMembers.splice(0, gAjaxPost.lasttimeGroupMembers.length)   //获取新的群组时，应先清空和上一次相关的群成员ID
      // gAjaxPost.Interval=setInterval("ListenCurrGroupMembers("+gAjaxPost.lasttime_selector+")",1000);
      gAjaxPost.Interval = self.setInterval(function () {
        var ID = $(gAjaxPost.curr_selector).attr('id')
        groupID = ID.substr(11)
        var jsondata = {
          "commonKey": "403",
          "appKey": "8",
          "data": {
            "groupID": groupID
          }
        }
        gAjaxPost.aysncPost("../../jsonGateway.php", JSON.stringify(jsondata), function (response) {
          addGroupMembers(response, groupID)
        })
      }, 100);
    }
    //ListenCurrGroupMembers(this)
    gAjaxPost.lasttime_selector = gAjaxPost.curr_selector
  })
  
}
function clickGroupName() {
  $("div.rightDown").on('click', 'div.lc-groupArea button.lc-groupclick', function () {
    // if(gAjaxPost.groupExistSign==true){
    gdEventTimer.addEvent('getGroupMembers', '1', 'div.rightDown')
    gdEventTimer.startTimer()
  })
}
function ListenCurrGroupMembers(select) {
  //$(select).on('getGroupMembers', function () {
  var ID = $(select).attr('id')
  groupID = ID.substr(11)
  var jsondata = {
    "commonKey": "403",
    "appKey": "8",
    "data": {
      "groupID": groupID
    }
  }
  gAjaxPost.aysncPost("../../jsonGateway.php", JSON.stringify(jsondata), function (response) {
    addGroupMembers(response, groupID)
  })
  // })
}
function addGroupMembers(response, groupID) {
  var curr_groupid = $(gAjaxPost.curr_selector).attr('id').substr(11)
  if (curr_groupid == groupID) {
    var members = JSON.parse(response)['data']
    gAjaxPost.currGroupMembers.splice(0, gAjaxPost.currGroupMembers.length)
    for (var i = 0; i < members.length; i++) {
      gAjaxPost.currGroupMembers[i] = members[i]['userID']
    }
    //remove gropuMembers offline
    for (var i = 0; i < gAjaxPost.lasttimeGroupMembers.length; i++) {
      if (gAjaxPost.currGroupMembers.indexOf(gAjaxPost.lasttimeGroupMembers[i]) == -1)
        $("#group" + groupID + 'userID' + gAjaxPost.lasttimeGroupMembers[i]).remove()
    }
    //add new members
    for (var i = 0; i < gAjaxPost.currGroupMembers.length; i++) {
      if (gAjaxPost.lasttimeGroupMembers.indexOf(gAjaxPost.currGroupMembers[i]) == -1) {
        var childdiv = '<div class="groupMember forclick" id="group' + groupID + 'userID' + gAjaxPost.currGroupMembers[i] + '"></div>'
        var parentdiv = $('#divgroup' + groupID)
        parentdiv.append(childdiv)
        $('#group' + groupID + 'userID' + gAjaxPost.currGroupMembers[i]).html(members[i]['userName'])
      }
    }
    gAjaxPost.lasttimeGroupMembers.splice(0, gAjaxPost.lasttimeGroupMembers.length)
    gAjaxPost.lasttimeGroupMembers = [].concat(gAjaxPost.currGroupMembers)
  }
}
function getGroupList() {
  var jsondata = {
    "commonKey": "403",
    "appKey": "2",
    //"sessionID": $('._gdData').data('session-id'),
    "data": {
      // "senderID": $('._gdData').data('user-id')
      "senderID": "15"
    }
  }
  gAjaxPost.aysncPost("../../jsonGateway.php", JSON.stringify(jsondata), function (response) {
    displayGroupList(response)
  })
}
function displayGroupList(response) {
  var groupID = JSON.parse(response)['data']
  gAjaxPost.currGroupID.splice(0, gAjaxPost.currGroupID.length)
  for (var i = 0; i < groupID.length; i++) {
    gAjaxPost.currGroupID[i] = groupID[i]['groupID']
  }

  //add new groupmembers
  for (var i = 0; i < gAjaxPost.currGroupID.length; i++) {
    if (gAjaxPost.lasttimeGroupID.indexOf(gAjaxPost.currGroupID[i]) == -1) {
      var childdiv = '<div class="lc-groupArea" id="divgroup' + groupID[i]['groupID'] + '"><button class="lc-groupclick" id="buttonGroup' + groupID[i]['groupID'] + '"' + '></button></div>'
      var parentdiv = $("div.rightDown")
      parentdiv.append(childdiv)
      $("#buttonGroup" + groupID[i]['groupID']).html(groupID[i]['groupName'])
    }
  }
  for (var i = 0; i < gAjaxPost.lasttimeGroupID.length; i++) {
    if (gAjaxPost.currGroupID.indexOf(gAjaxPost.lasttimeGroupID[i]) == -1) {
      $("#divgroup" + gAjaxPost.lasttimeGroupID[i]).remove()
    }
  }
  gAjaxPost.lasttimeGroupID = [].concat(gAjaxPost.currGroupID)
  //getUsersInGroup()  //向生成的群组名下添加成员
}
function getUsersInGroup() {
  var jsondata = {
    "commonKey": "403",
    "appKey": "8",
    "data": {
      "groupID": "1"
      // "senderID":$('._gdData').data('user-id')
    }
  }
  for (var i = 0; i < gAjaxPost.currGroupID.length; i++) {
    jsondata['data']['groupID'] = gAjaxPost.currGroupID[i]
    // $.ajax({
    //   url: "../../jsonGateway.php",
    //   data: JSON.stringify(jsondata),
    //   async: false,
    //   contentType: "application/x-www-form-urlencoded",
    //   success: function (response) {
    //     addGroupMembers(response, gAjaxPost.currGroupID[i])
    //   }
    // })
    gAjaxPost.aysncPost("../../jsonGateway.php", JSON.stringify(jsondata), function (response) {
      addGroupMembers(response, gAjaxPost.currGroupID[i])
    })
  }
}
function postOut_1(url, package, origin) {  // package is a json string, origin is the object who initial the post, and receive the reponse event
  var json = { gdData: gAjaxPost.finalPack(package) };  // build data for post

  //var origin1 = $(origin);    // make it jquery style

  $.post(
    url,   // url
    json,                            // data
    function (response, status, xhr) {                     // success, 
      origin.trigger('postResponse', response);	  // return result by event postResponse
    });

}// postOut
function friendList(response, parent) {
  gAjaxPost.personalInformation = JSON.parse(response)['data']
  kk = JSON.parse(response)
  gAjaxPost.currFriend = []
  for (var i = 0; i < kk['data'].length; i++) {
    gAjaxPost.currFriend[i] = parseInt(kk['data'][i]['userID'])
  }
  //remove friend offline
  for (var i = 0; i < gAjaxPost.lasttimeFriend.length; i++) {
    if (gAjaxPost.currFriend.indexOf(gAjaxPost.lasttimeFriend[i]) == -1) {
      $("#" + gAjaxPost.lasttimeFriend[i]).remove()					//delete friend off line
    }
  }

  for (var i = 0; i < gAjaxPost.currFriend.length; i++) { //add friend new online
    if (gAjaxPost.lasttimeFriend.indexOf(gAjaxPost.currFriend[i]) == -1) {
      var agentlist = gAjaxPost.currFriend

      var childdiv = $('<div></div>');   // create div node
      //var b='child'+i;              
      childdiv.attr('id', gAjaxPost.currFriend[i]);          //set id                     //set css style
      childdiv.attr('class', 'forclick')
      childdiv.attr('data-chat', '[]')   //set data-chat
      parentdiv = parent
      parentdiv.append(childdiv)
      if (parseInt($('._gdData').data('user-id')) == gAjaxPost.currFriend[i]) {
        $('#' + gAjaxPost.currFriend[i]).html(kk['data'][i]['userName'] + '                   ME')  //sign of me
      } else {
        $('#' + gAjaxPost.currFriend[i]).html(kk['data'][i]['userName']);
      }
      var myvideo = document.getElementById("onlinesound")    //add volice
      myvideo.play()
      // myvideo.play()
      //$("#onlinesound").play()
    }
  }

  gAjaxPost.lasttimeFriend = [].concat(gAjaxPost.currFriend)
  lunxunChatData()
}
function receiveChatData(response) {                    //应将data-chat初始化，然后往里动态添加
  var a = JSON.parse(response);
  if (a['data'].length != 0) {
    var M = a['data'].length;
    for (var i = 0; i < a['data'].length; i++) {   //轮询每条收到的数据   
      var index = gAjaxPost.currFriend.indexOf(parseInt(a['data'][i]['senderID']))
      if (index != -1) {
        $('#' + gAjaxPost.currFriend[index]).data('chat').push(a['data'][i])
      }//实时往聊天对话框加信息
      if (a['data'][i]['senderID'] == gAjaxPost.currChatFriendID) {
        var childdiv = $("<div></div>")
        var timestamp = (new Date()).getTime();
        var b = 'div_' + timestamp;
        childdiv.attr('id', b);
        var parentdiv = $('div#lc-chatBox')
        parentdiv.append(childdiv)
        parentdiv.append($('<br />'))
        $("#" + b).html(a['data'][i]['textMsg'])
      }
    }
    gAjaxPost.lastDialogID = parseInt(a['data'][M - 1]['dialogID'])
    console.log(gAjaxPost.lastDialogID)
  }
}
function chatRecord(a) {
  $("#lc-chatBox").empty()
  $("#lc-wordinput").val("")
  gAjaxPost.currChatFriendID = $(a).attr("id");      //获取当前联系人的ID
  var read = $('#' + gAjaxPost.currChatFriendID).data('chat');	//read chat record
  console.log(read)
  if (read.length != 0) {                                //为空并不是undefined
    for (var i = 0; i < read.length; i++) {
      var childdiv = $('<div></div>'); //creat div
      var b = 'div_' + i;
      childdiv.attr('id', b);
      parentdiv = $('#lc-chatBox');
      parentdiv.append(childdiv)
      parentdiv.append($('<br />'))
      $('#' + b).html(read[i]['textMsg']);
      if (read[i]['senderID'] == $('._gdData').data('user-id')) {
        $("#" + b).css({ "float": "right" })
      }
    }
  }
  $("#lc-chatBox").scrollTop(1000)
}
function chatboxscroll() {
  var divscroll = document.getElementById('lc-chatBox')
  var wholeHeight = divscroll.scrollHeight;
  var scrollTop = divscroll.scrollTop;
  var divHeight = divscroll.clientHeight;
  if (scrollTop + divHeight >= wholeHeight) {
    alert('滚动到底部了！');
    //这里写动态加载的逻辑，比如Ajax请求后端返回下一个页面的内容
  }
  if (scrollTop == 0) {
    alert('滚动到头部了！');
  }
}
function sendMsg() {
  var sendMsg = {						//发送消息
    "commonKey": "100",
    "appKey": "4",
    "sessionID": $('._gdData').data('session-id'),
    "data": {
      "senderID": "15",
      //"senderID": $('._gdData').data('user-id'),
      "receiverID": gAjaxPost.currChatFriendID,
      "groupID": "groupID",
      "msgType": "1",
      "textMsg": $("#lc-wordinput").val(),
      "lastDialogID": gAjaxPost.lastDialogID,
      "contentType": "1",
    }
  }
  // gAjaxPost.postOut_1("../../jsonGateway.php", JSON.stringify(sendMsg), $("#sendMSG"))//这里没有将响应做处理
  gAjaxPost.aysncPost("../../jsonGateway.php", JSON.stringify(sendMsg), function (response) {
    console.log('message send success' + response)
  })
  $("#" + gAjaxPost.currChatFriendID).data('chat').push(sendMsg['data'])
  var childdiv = $('<div></div>'); //creat div
  var timestamp = (new Date()).getTime();
  var b = 'div_' + timestamp;
  childdiv.attr('id', b);
  parentdiv = $('#lc-chatBox');
  parentdiv.append(childdiv)
  parentdiv.append($('<br />'))
  $("#" + b).html(sendMsg['data']['textMsg'])
  $("#" + b).css({ "float": "right" })
}
function popUpChatPage() {
  openChatPage()
  var offsetX = 0;
  var offsetY = 0;
  var bool = false;
  $("div#lc-chatPage").mousedown(function () {
    bool = true;
    offsetX = event.offsetX;
    offsetY = event.offsetY;
    $("#lc-close-chatPage").css('cursor', 'move');
  })
  $("div#lc-chatPage").mouseup(function () {
    bool = false;
  })
  $(document).mousemove(function (e) {
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
  var url_1 = "../../jsonGateway.php"
  var jsondata = {
    "commonKey": "100",
    "appKey": "1",
    //"sessionID": $('._gdData').data('session-id'),
    "data": {
      // "senderID": $('._gdData').data('user-id')
      "senderID": "15"
    }
  }
  gAjaxPost.aysncPost(url_1, JSON.stringify(jsondata), function (response) {
    friendList(response, $(".Friend"))
  })
  // postOut_1(url_1, JSON.stringify(jsondata), $('.Friend'))
  // $(".Friend").one("postResponse", function (event, response) {
  //   friendList(response, $(".Friend"))
  // })
}
function lunxunChatData() {
  var jsondata = {
    "commonKey": "100",
    "appKey": "3",
    "sessionID": $('._gdData').data('session-id'),
    "data": {
      // "senderID": $('._gdData').data('user-id'),
      "senderID": "15",
      "lastDialogID": gAjaxPost.lastDialogID
    }
  }
  gAjaxPost.aysncPost("../../jsonGateway.php", JSON.stringify(jsondata), function (response) {
    var a = JSON.parse(response);
    console.log(a['appKey'] + "-------------------" + a['data'].length + "--------------")
    receiveChatData(response)
  })
  // postOut_1("../../jsonGateway.php", JSON.stringify(jsondata), $(".right")) //friendbox随便绑定的
  // $(".right").one("postResponse", function (event, data) {
  //   var a = JSON.parse(data);
  //   console.log(a['appKey'] + "-------------------" + a['data'].length + "--------------")
  //   receiveChatData(data)
  // })
}


/* div rightDown js end here */

/** added by lb ----start----- */
function initRightupRegion() {
  gAjaxPost.aysncPost = function (url, package, callback) {
    var json = { gdData: gAjaxPost.finalPack(package) };
    $.post(
      url,   // url
      json,                            // data
      function (response, status, xhr) {                     // success, 
        callback(response)	  // return result by event postResponse
      });
  }
  gAjaxPost.aysncPostFormData = function (url, formData, callback) {   // formData is FormData object
    $.ajax({
      url: url,
      type: "POST",
      processData: false,
      contentType: false,
      data: formData,
      success: function (response, status, xhr) {
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
  gAjaxPost.aysncPost('../../jsonGateway.php', JSON.stringify(jsonPkg), function (response) {
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
  var availablePlayer = ['player0', 'player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8']
  users.forEach(function (user, index) {
    if (user.sceneID) {
      var url = RightUp.rtmpBaseUrl + user.userID + 'AAA' + user.sceneID
      var index1 = whichPlaying(url)
      if (index1 < 0) {
        notPlaying.push(user)
      } else {
        availablePlayer.splice(availablePlayer.indexOf('player' + index), 1)
        updatePlayerStatus('player' + index, user.status)
      }
    }
  })
  if (availablePlayer.length > 0 && notPlaying.length > 0) {
    availablePlayer.forEach(function (player, index) {
      if (index < notPlaying.length) {
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
  if (Number(status) == 2) {
    $('#' + player).parent().removeClass('warnning-border')
    $('#' + player).parent().addClass('alert-border')
  } else if (Number(status) == 3) {
    $('#' + player).parent().removeClass('alert-border')
    $('#' + player).parent().addClass('warnning-border')
  } else {
    $('#' + player).parent().removeClass('alert-border')
    $('#' + player).parent().removeClass('warnning-border')
  }
  $('#' + player + '-send2main-btn').show()
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
  if (!mainUrl) {
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
  $('#' + player + '-button').text(userName)
  // RightUp[player].onSeek(function(event){ 
  //   console.log('ready')
  //   // console.log($('#'+player/* + ' .jw-media' */)[0])
  //   $('#'+player)[0].bind('click',sendToMainScreen(1))
  // });
  RightUp[player].on('displayClick', function () {
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
  }, function (response, status, xhr) {
    console.log(response)
    var baseUrl = 'http://192.168.0.160:8000/'
    var myImage = new Image();
    myImage.crossOrigin = "Anonymous";

    myImage.onload = function () {
      var imgWidth = myImage.width;
      var imgHeight = myImage.height;
      var $canvas = $('#canvasDemo')
      if ($canvas.length == 0) {
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
      $('#myModal .modal-content').width(imgWidth + 50)
      $('.modal-dialog').css('margin-left', document.body.clientWidth / 2 - imgWidth / 2 - 50)
      $('#myModal').modal('show')
    }
    myImage.src = baseUrl + response.imageUrl;
  })
}

function handleSubmit() {
  console.log('handleSubmit')
  canvas2blobPollyfill()
  var canvas = $('#canvasDemo')[0]
  canvas.toBlob(function (blob) {
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
    gAjaxPost.aysncPostFormData('../../jsonGateway.php', fd, function (res) {
      console.log(res)
      $('#myModal').modal('hide')
    })
  });
}

function canvas2blobPollyfill() {
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function (callback, type, quality) {

        var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
          len = binStr.length,
          arr = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback(new Blob([arr], { type: type || 'image/png' }));
      }
    });
  }
}

function getMainScreenUserId() {
  var userId;
  if (RightUp.mainUrl) {
    var urlArray = RightUp.mainUrl.split('/')
    return urlArray[urlArray.length - 1].split('AAA')[0]
  }
  return 0
}

function zoomVideo(region) {
  console.log(region)
  var baseUrl = 'http://192.168.0.160:8000/'
  $.get('http://192.168.0.160:8000/api/zoom', {
    url: RightUp.mainUrl,
    region: region
  }, function (response, status, xhr) {
    console.log(response)
    if (!response.errormsg) {
      RightUp.mainUrl = RightUp.mainUrl.split('zoomhelper')[0] + 'zoomhelper'
      attachToMainPlayer()
    }
  })
}

function resetZoom() {
  RightUp.mainUrl = RightUp.mainUrl.split('zoomhelper')[0]
  attachToMainPlayer()
}

/** added by lb ----start----- */

///ZXH部分

function initialThisPartie() {
  initialVars();
  initialMap();
  initialAgentsandGroup();
  initData();
}
function initialVars() {
  var global = global || {};
  window.global = global;
  //初始化version配置
  gVersion.init();
  //自动更新当前version
  gVersion.updateVersion();
  //初始化异步响应
  gAjaxPost.init();
  gAjaxPost.AsyncPostFormData = function (url, formData, origin, callback) {   // formData is FormData object

    gAjaxPost.origin = $(origin);    // make it jquery style

    $.ajax({
      url: url,
      type: "POST",
      processData: false,
      contentType: false,
      //   	   contentType: "multipart/form-data",
      data: formData,
      success: function (response, status, xhr) {
        callback(response);	  // return result by event postResponse
      }
    });
  }
  gAjaxPost.asyncPost = function (url, package, origin, callback) {
    var json = { gdData: gAjaxPost.finalPack(package) };  // build data for post

    gAjaxPost.origin = $(origin);    // make it jquery style

    $.post(
      url,   // url
      json,                     // data
      function (response, status, xhr) {
        callback(response)                     // success, 
      });
  }
}
function initialMap() {
  var map = new BMap.Map("allmap");
  global.map = map;
  //创建控件
  var top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT });// 左上角，添加比例尺
  var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
  //添加控件
  map.addControl(top_left_control);
  map.addControl(top_left_navigation);
  map.centerAndZoom(new BMap.Point(116, 40), 2);  // 设置中心点
  map.addControl(new BMap.MapTypeControl());
  map.enableScrollWheelZoom(true);
}

function initData() {
  //每隔3秒执行一次方法
  //初始化GPS中的定位点坐标，并每3秒刷新其坐标
  window.setInterval("initialAgentsandGroup()", 10000);

}
//桌面弹窗报警提示
function showNotice() {
  Notification.requestPermission(function (perm) {
    if (perm == "granted") {
      var notification = new Notification("收到报警信息！", {
        dir: "auto",
        lang: "alert",
        tag: "test",
        icon: null,
        body: "检测到警情！"
      })
    }
  })
}

function initialAgentsandGroup() {
  jsonPkg = {
    "commonKey": 200,
    "appKey": 1,
    "tag": "",
    "option": "",
    "priority": 1,
    "timeStamp": "",
    "arrivalTime": "",
    "status": -1,
    "errorMsg": "something wrong",
    "data": ""
  };
  var url = "../../jsonGateway.php";
  urlbackend = url;
  gAjaxPost.asyncPost(url, JSON.stringify(jsonPkg), this, function (res) {
    responseHandler_GPSRefresh(res)
    console.log(res)
    var data = JSON.parse(res);
    filtrageAlertEvent(data)
  });
}

function responseHandler_GPSRefresh(response) {
  global.map.clearOverlays()
  //创建地图     
  addMarker(JSON.parse(response).data);

}


//创建标注点并添加到地图中
function addMarker(points) {
  //循环建立标注点
  var marker;
  for (var i = 0, pointsLen = points.length; i < pointsLen; i++) {
    var point = new BMap.Point(points[i].gpsLongtitude, points[i].gpsLatitude); //将标注点转化成地图上的点
    if (Number(points[i].status) === 1) {
      var gmyIcon = new BMap.Icon("../image/normal_marker.png", new BMap.Size(50, 50));
      marker = new BMap.Marker(point, { icon: gmyIcon });  // 创建标注
    } else if (Number(points[i].status) === 2) {
      var gmyIcon = new BMap.Icon("../image/alarm_marker.png", new BMap.Size(50, 50));
      marker = new BMap.Marker(point, { icon: gmyIcon });  // 创建标注
    } else if (Number(points[i].status) === 3) {
      var gmyIcon = new BMap.Icon("../image/pre_marker.png", new BMap.Size(50, 50));
      marker = new BMap.Marker(point, { icon: gmyIcon });  // 创建标注
    }


    // var marker = new BMap.Marker(point); //将点转化成标注点
    global.map.addOverlay(marker);  //将标注点添加到地图上
    // gmarker.setAnimation(BMAP_ANIMATION_BOUNCE);
    processMarker(i, points, marker)
  }
}
function processMarker(i, points, marker) {
  var thePoint = points[i];
  marker.addEventListener('click', function (event, data) {
    switch (event.type) {
      case 'onclick':
        showInfo(this, thePoint);
        global.PKG = configFormData('3', thePoint.userID.toString(), '1', '2', null, null, '100');
        global.receiverID = thePoint.userID
        global.receiverName = thePoint.fullName
        global.sceneID = thePoint.sceneID
        global.curMarker = this;
        global.point = thePoint;
        asynRefresh(global.PKG);
        global.refreshMarker = setInterval('asynRefresh(global.PKG)', 3000);
        break;
    };
  });
}
function asynRefresh(jsonPkg) {
  gAjaxPost.AsyncPostFormData('../../jsonGateway.php', jsonPkg, this, function (response) {
    // ResponseHandler_clickMarker(response);
  });
}
function showInfo(thisMarker, point) {
  //获取点的信息
  var sContent = "";
  if (point.status == 2) {
    sContent =
      '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
      + '<li style="line-height: 26px;font-size: 15px;">'
      + '<span style="width: 50px;display: inline-block;">编号：</span>' + point.userID + '</li>'
      + '<li style="line-height: 26px;font-size: 15px;">'
      + '<span style="width: 100px;display: inline-block;">行动单位：</span>' + point.userName + '</li>'
      + '<li style="line-height: 26px;font-size: 15px;">'
      + '<button id="getVideo" onclick="gethandleVideo()" style="width: 100px;display: inline-block;">处理现场</button>'
      + '<button id="cancel" style="width: 100px;display: inline-block;">取消</button>'
      + '</ul>';
    global.receiverID = point.userID;
    global.receiverName = point.userName;
  } else if (point.status == 1 || point.status == 3) {
    sContent =
      '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
      + '<li style="line-height: 26px;font-size: 15px;">'
      + '<span style="width: 50px;display: inline-block;">编号：</span>' + point.userID + '</li>'
      + '<li style="line-height: 26px;font-size: 15px;">'
      + '<span style="width: 100px;display: inline-block;">行动单位：</span>' + point.userName + '</li>'
      + '<li style="line-height: 26px;font-size: 15px;">'
      + '<span style="width: 100px;display: inline-block;">更新时间：</span></br>' + point.birthday + '</li>'
      + '<button id="getlNormalVideo" onclick="getVideo()" style="width: 100px;display: inline-block;">现场视频</button>'
      + '<button id="cancel" style="width: 100px;display: inline-block;">取消</button>'
      + '</ul>';
  }

  var infoWindow = new BMap.InfoWindow(sContent); //创建信息窗口对象
  thisMarker.addEventListener('infowindowclose', function (event) {
    clearInterval(global.refreshMarker);

  })
  thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
  // getVideo();
}

function configFormData(appkey, senderID, receiverID, msgtype, msg, groupID, commonKey) {
  var jsonPkg = {
    "commonKey": commonKey ? commonKey : '200',
    "appKey": appkey ? appkey : '1',
    "tag": "",
    "option": "",
    "priority": "1",
    "timeStamp": "",
    "arrivalTime": "",
    "status": "-1",
    "errorMsg": "something wrong",
    "data": {
      'senderID': senderID ? senderID : "1",
      'receiverID': receiverID ? receiverID : "1",
      'groupID': groupID ? groupID : "-1",
      'gpsLatitude': "-1",
      'gpsLongtitude': "-1",
      'msgType': msgtype ? msgtype : "1",
      'lastDialogID': "1",
      'textMsg': msg ? msg : "",
    }
  }
  $("form input.gdData").val(JSON.stringify(jsonPkg));
  var fdata = new FormData($("form.post-helper")[0]);
  return fdata;
}

function filtrageAlertEvent(data) {
  if (data != null) {
    var listAlertEvent = {};
    for (var i = 0; i < data.data.length; i++) {
      if (data.data[i].status == 2) {
        listAlertEvent.push(data.data[i]);
      }
    }
    if (listAlertEvent.length > 0) {
      showNotice();
    }
  }

}

function makeUpAlertEventUI() {
  var EventDiv = ""

}