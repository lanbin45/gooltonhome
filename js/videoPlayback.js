$(document).ready(function() {

  gVersion.init();
 
  gVersion.updateVersion();
  gAjaxPost.init();
  
  gdSceneVideo.init();
  gVideoStream.init();

  $("button.realTime").on('click postResponse', function(event, data){
	 realTime(event, data, this); 
  });
  

  $("button.asyncPlay").on('click postResponse', function(event, data){
	  asyncPlay(event, data, this);

  });
  

  $("button.submitForm").off('click postResponse').on('click postResponse', function(event, data){
//console.log(event.type+" data: " + data);
	  switch (event.type){
		  case 'click':

//		    var sceneID=$("div.head input.sceneID").val();
		    submitForm(this);
		    break;
		  case 'postResponse':  // do your work here after receive return
              gdSceneVideo.handleResponse(data);
//                responseHandler(data);
		    break;
	  };
    });
  

  
});

function asyncPlay(event, data, node){
//console.log(event.type+" data: " + data);
	  switch (event.type){
		  case 'click':
		    gdSceneVideo.asyncDateList(node);
//		    submitForm(node);
		    break;
		  case 'postResponse':  // do your work here after receive return
            gdSceneVideo.handleResponse(data);
//                responseHandler(data);
		    break;
	  };
}

function realTime(event, data, node){
	var today=new Date().toISOString().slice(0, 10);
//today="2018-07-25";
	        switch (event.type){
	   	      case 'click':
	   	         json=JSON.parse('{}');
	   	         json['sceneDate']=today;

                 gdSceneVideo.requestSceneIDs(json.sceneDate, node, -1);   	      
//                 gdSceneVideo.requestReqlTimeSceneID(json.sceneDate, node);   	      
		        break;
		      case 'postResponse':  // do your work here after receive return
                gdSceneVideo.handleResponse(data);
		        break;
	        };		
    
console.log(today+" : real time playing");
}

function asyncDateList(event, data, node){
}

function submitForm(obj){
	var s, appKey=$("div.head input.appKey").val();
	s=JSON.parse('{"commonKey":300, "startTime":0}');
	s['appKey']=appKey;
	s['data']=JSON.parse('{}');
	s.data['sceneDate']=$("input.sceneDate").val();
	
	gAjaxPost.postOut($(obj).attr("data-url"), JSON.stringify(s) , obj);
console.log($(obj).attr("data-url"));	
	
}
