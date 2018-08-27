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
		    $("form input.gdData").val(jsonPkg);
		    formData=myFile();

//console.log(fileData + $("form input.gdData").attr("type"));
//            postFile(fileData);
		    gAjaxPost.postFormData(url, formData, this);
		    break;
		  case 'postResponse':  // do your work here after receive return
            responseHandler(data);
		    break;
	  };
  });
  
});

function postFile(formData){
console.log(formData);
	$.ajax({
	   url: "jsonGateway.php",
	   type: "POST",
        processData: false, 
        contentType: false, 
//   	   contentType: "multipart/form-data",
	   data: formData
	});
}


function responseHandler(response){
	$('div.ctrlBar b.currTime').html(response);
}


function myJson(){
	var json=JSON.parse("{}");

    var x, h=$("div.head").children("input");
    for(var i=0; i<h.length; i++){
		x=$(h[i]);
		json[x.attr("name")]=x.val();
//console.log(x.val() + " -- "+ x.attr("name") );	
	}
    
    var jdata=JSON.parse("{}");
    h=$("div.data").children("input, textarea");
    for(var i=0; i<h.length; i++){
		x=$(h[i]);
		jdata[x.attr("name")]=x.val();
//console.log(x.val() + " -- "+ x.attr("name") );	
	}
    
    json['data']=jdata;
console.log(json);
    return JSON.stringify(json);
}

function myFile(){
	var fdata= new FormData($("form")[0]);
	return fdata;
}
