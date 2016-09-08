YTJS
====

Universal Youtube Javascript Library for Node JS and browser.

No Jquery needed.


## How to get Youtube API Key

[Click here](http://help.dimsemenov.com/kb/wordpress-royalslider-tutorials/wp-how-to-get-youtube-api-key)


## Node JS 

Example
    
    var ytJS = require('./yt-core');

    var youtube  = ytJS("API KEY");
    
    youtube.getdata({ videoId: "TlgqWeuhJj4"},function(err, result){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(result);
    });


## Browser

Initalize the library

    var youtube  = $youtube("API KEY");

Getting the data

     youtube.getdata({ videoId: "TlgqWeuhJj4" },function(err, result){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(result);
     });
            
    var information = youtube.getdata({ videoId: "PMr2NRPdpH4"}, function(err, result){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(result);
    });
    

Searching for Videos
    
    youtube.search({keyword: "rihanna love", fullResults: 1, order: "relevance"}, function(err, data){
        if(err) {
          console.log(err);
          return false;
        }
        console.log(data);
    });


## Upcoming Plan

[] Comments

[] Related Videos

[] npm module



