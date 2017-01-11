'use strict';

var ytJS = require('../');

var youtube  = ytJS("API KEY"); //replace with your API KEY

youtube.getdata({ videoId: "TlgqWeuhJj4"},function(err, result){
    if(err) {
      console.log(err);
      return false;
    }
    console.log(result);
});
