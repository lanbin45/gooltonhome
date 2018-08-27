
var gVersion={

   verInfo : 'div.verInfo i.verInfo',
      
   init: function(){
	   
	   gVersion.verInfo=$(gVersion.verInfo);	    

   },
      
   updateVersion: function(){
   
      var x;
      x={appKey: "3"}; // showData
      gVersion.verInfo.load('version.php', x, function(){

	  });     
 
   } // updateVersion
   


};
