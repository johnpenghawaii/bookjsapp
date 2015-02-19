/*
   Event Handler HOOKS and Implementations.
 */

var mediaRecFile =  "Recording001.wav" ;
var my_recorder = null, my_player = null;
var app = {
    
    init: function() {
	
         $('#camcontrol').on('click', function() {
            app.oncamButtonClick();
        }); 		
		
		$('#miccontrol').on('click', function() {
            app.onmicButtonClick();
        });
		
		$('#stopreccontrol').on('click', function() {
            app.onstopButtonClick(); 
        });
    	
		$('#playcontrol').on('click', function() {
            app.onplayButtonClick();
        });
		
		$('#stopplaycontrol').on('click', function() {
            app.onstopplayButtonClick();
        });
    },
	onSuccess: function(imageData) {
       var image = document.getElementById('CaptchaImg');
       image.src = imageData;
       image.style.margin = "10px";
       image.style.display = "block";
	   
	   var images = document.getElementById('ShowImg');
       images.src = imageData;
       images.style.margin = "10px";
       images.style.display = "block";
	   
	   var images = document.getElementById('RecodeImg');
       images.src = imageData;
       images.style.margin = "10px";
       images.style.display = "block";
	   
	   app.movePic(imageData);
	   
    },
	onFail: function(imageData) {
       console.log("Picture failure: " + message);
    },
	oncamButtonClick: function() {
	     console.log('Start cam Session');
	     navigator.camera.getPicture(app.onSuccess, app.onFail, {
                quality: 100,
                targetWidth: 400,
                targetHeight: 400,
                destinationType: Camera.DestinationType.FILE_URI,
                correctOrientation: true
            });
	},
    
	
	
	movePic:         function (file){ 
console.log("original file entry:"+file); 	
	window.resolveLocalFileSystemURL(file, app.resolveOnSuccess, app.resOnError);
	
    }, 

//Callback function when the file system uri has been resolved
    resolveOnSuccess: function(entry){ 
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = "MyAppFolder";
    console.log('Start request file Session');
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {    
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( myFolderApp,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.copyTo(directory, newFileName,  app.successMove, app.resOnError);
                    },
                    app.resOnError);
                    },
    app.resOnError);
    },
	//Callback function when the file has been moved successfully 
    successMove: function(entry) {
   
    var gdocs = new GDocs();
	if (!gdocs.accessToken) {
	  gdocs.auth(true, function() {
      console.log("first auth done"); 
      entry.file(function(file) {
	     gdocs.upload(file, function() {
         console.log("upload file completed"); 
              }, true); 
	    },function(){console.log("file resolve error");});
	  
      });	  
    } else {
	  gdocs.revokeAuthToken(function() {
	  console.log("revoke auth done");
	   entry.file(function(file) {
	     gdocs.upload(file, function() {
         console.log("upload file completed"); 
              }, true); 
	    },function(){console.log("file resolve error");});
	  
	  });
	 } 
   
   
    },

    resOnErrorL: function(error) {
    alert(error.code);
    },

	// Media() success callback        
    onMediaCallSuccess:function () {
    console.log("***test: mic new Media() succeeded ***");
    },
    // Media() error callback        
    onMediaCallError:function (error) {
    console.log("***test: mic new Media() failed ***" + error);
    },	
	onmicButtonClick: function() {
	      console.log('Start mic Session');
		  if (my_recorder)
             my_recorder.release();
		  try
		  {
		   my_recorder = new Media(mediaRecFile, app.onMediaCallSuccess, app.onMediaCallError);
		  } catch(e)
            {
               console.log('record error'+ e);
             }			
	       my_recorder.startRecord();
		   document.getElementById('recordmsg').innerHTML = "Status: recording";
	},
	onstopButtonClick: function() {
	      console.log('Stop mic Session');
		   my_recorder.stopRecord();
	
	},
	onplayButtonClick: function() {
	      console.log('play wav Session');
		   my_player = new Media("/sdcard/" + mediaRecFile, app.onMediaCallSuccess, app.onMediaCallError);
		   if(my_player)
		   {
		     my_player.play();
		   } else
		       { 
			      console.log('no media file');
			   }
	
	},
	
	onstopplayButtonClick: function() {
	      console.log('stop play wav Session');
		    if (my_player) {
                my_player.stop();
				my_player.release();
				my_player = null; 
		    }
	
	}
	
	
	
    	
}; 
 
 

$(document).ready(function() {
	 console.log( "document ready!" );
	/* startApp after device ready */
	document.addEventListener('deviceready', startApp, false);
});


/**
 * Start the App
 */
 
 
function startApp() {
	
	console.log("device ready");
	app.init();
	
}


