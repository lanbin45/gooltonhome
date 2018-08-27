$(document).ready(function() {

  gVersion.init();
 
  gVersion.updateVersion();
  
  gAjaxPost.init();
  
  $("button.btnAjaxPost").on('click postResponse', function(event, data){
console.log(event.type+" data: " + data);
	  switch (event.type){
		  case 'click':
		    url=$(this).attr('data-url');
		    jsonPkg=myJson();
		    gAjaxPost.postOut(url, jsonPkg, this);
		    break;
		  case 'postResponse':  // do your work here after receive return
            responseHandler(data);
		    break;
	  };
  });
  
});


function responseHandler(response){
	$('div.ctrlBar b.currTime').html(response);
}


function myJson(){
	var json=JSON.parse("{}");
/**	
	json['commonKey']=$('input.commonKey').val();
	json['appKey']=$('input.appKey').val();	
	
	json['data']={"userID":$('input.userID').val(), "sceneID":$('input.sceneID').val()};
**/

    var x, h=$("div.head").children("input");
    for(var i=0; i<h.length; i++){
		x=$(h[i]);
		json[x.attr("name")]=x.val();
console.log(x.val() + " -- "+ x.attr("name") );	
	}
    
    var jdata=JSON.parse("{}");
    h=$("div.data").children("input, textarea");
    for(var i=0; i<h.length; i++){
		x=$(h[i]);
		jdata[x.attr("name")]=x.val();
console.log(x.val() + " -- "+ x.attr("name") );	
	}
    
    json['data']=jdata;
    return JSON.stringify(json);
}
