'use strict';

var ytJS = require('./yt-core');

var youtube  = ytJS("AIzaSyByRmx5gnlNOoJMX9lqGZrOWbkaI6xcIC0");

youtube.getdata({ videoId: "TlgqWeuhJj4"},function(err, result){
    if(err) {
      console.log(err);
      return false;
    }
    console.log(result);
});
