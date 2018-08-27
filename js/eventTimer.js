$(document).ready(function() {

  gVersion.init();
 
  gVersion.updateVersion();
  
  gdEventTimer.init();
  
  $("button.startTimer").on('click', function(){
     gdEventTimer.startTimer();
	  
  });
  
  
  $("button.stopTimer").on('click', function(){
console.log('-- get stopTimer.click');	  
     gdEventTimer.stopTimer();	  
  });
  
  $("button.add").on('click', function(){
	 var evt;
	 evt=$("div.eventBox").children("input");
     gdEventTimer.addEvent($(evt[0]).val(), $(evt[1]).val(), $(evt[2]).val(), $(evt[3]).val());
     	  
  });
  
  $("button.remove").on('click', function(){
	 var evt;
console.log("remove clicked");
	 evt=$("div.eventBox").children("input");
     gdEventTimer.removeEvent($(evt[0]).val(), $(evt[1]).val(), $(evt[2]).val(), $(evt[3]).val());
     	  
  });
  
  
  
  
// response  
  $('button.stopTimer').on('stopTimer', function(event){
	  $('button.stopTimer').trigger('click');
console.log('get stopTimer');	  
  });
  
  $('input.eventName').on('runMsg', function(event){
console.log('get runMsg');	  
  });
  
});
