YTjs
====

Universal Youtube Javascript Library for Node JS and browser.

No Jquery needed.


## How to get Youtube API Key

[Click here](http://help.dimsemenov.com/kb/wordpress-royalslider-tutorials/wp-how-to-get-youtube-api-key)


## Node JS 

Example
    
    var ytJS = require('ytjs');

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
            
    youtube.getdata({ videoId: "PMr2NRPdpH4"}, function(err, result){
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

## Options


### getdata

1. videoId : youtube video id
2. part: "snippet,statistics,contentDetails"  // you can pass either of three orcombination or all


#### output format 

You can get wide variety of data from `getdata` method and always youtube original data can be referred in `raw`

    "title":
    "description":
    "rating":
    "views":"",
    "publishedAt":
    "dthumbnail":
    "mthumbnail":
    "hthumbnail":
    "sthumbnail":
    "categoryId":
    "channelTitle":
    "videoId":"",
    "duration":
    "mins":
    "hr":
    "secs":
    "dimension":
    definition":
    caption":
    licensedContent":
    "viewCount":
    "likeCount":
    "dislikeCount":
    "favoriteCount":
    "commentCount":
    "kind":
    "channelId":
    "thumbnails":{}
    "tags":{}
    "liveBroadcastContent":"none"
    "localized":{}
    "projection":
    "raw":{}
    

### search

1. keyword : keyword for search
2. order: "relevance"  // date, rating, viewCount, videoCount, title
3. type : "basic" // "detailed" will provide additional information for each search video
4. navigate : "next" // would render next set of results as youtube only allows 50 videos at a time


#### output format 

You can get wide variety of data from `search` method. Results of search will be returned in `videos` array and always youtube original data can be referred in `raw`

    "videos" : []
    nextPageToken:
    prevPageToken:
    kind:
    


## Upcoming Plan

[ ] Comments

[ ] Related Videos

[ ] npm module



